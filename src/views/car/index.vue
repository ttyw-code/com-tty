<template>
  <section class="car-scene">
    <div ref="container" class="car-scene__canvas"></div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { useThree } from '@/utils/3DUtils/useThree'
import {
  createGridMaterial,
  getCarMaterial,
} from '@/utils/3DUtils/threeMaterials'
import { loadObjModel } from '@/utils/3DUtils/loadModel'

/** 场景底色更深一点，车漆和环境反射更跳 */
const BG_COLOR = 0x15171c
const GRID_SIZE = 200

const container = ref<HTMLElement | null>(null)

const { onReady } = useThree(container, {
  bgColor: BG_COLOR,
  // 略高于车身、斜后方 45°，能同时看到侧面和车顶
  cameraPosition: { x: 4, y: 2.4, z: 5 },
})

onReady(async ({ scene, renderer, controls }) => {
  // 金属和玻璃的质感全靠环境反射：没有 envMap 时 metalness 越高越接近纯黑
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()

  // 环境贴图之外补一盏主光，让车身的明暗有明确方向
  scene.add(new THREE.AmbientLight(0xffffff, 0.2))
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2)
  keyLight.position.set(4, 8, 6)
  scene.add(keyLight)

  // 地面网格 + 同色雾：远处自然淡出，不出现网格边界
  const grid = new THREE.Mesh(
    new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE),
    createGridMaterial(GRID_SIZE),
  )
  grid.rotation.x = -Math.PI / 2
  scene.add(grid)
  scene.fog = new THREE.Fog(BG_COLOR, 18, 60)

  // 视线略抬到车身中部，旋转时车不会偏离画面中心
  if (controls) {
    controls.target.set(0, 0.5, 0)
    controls.update()
  }

  try {
    const car = await loadObjModel(`${import.meta.env.BASE_URL}map/r8.obj`)

    car.scale.setScalar(0.001)
    car.updateMatrixWorld(true)

    // 按包围盒归位：水平居中、底面正好落在网格上
    const box = new THREE.Box3().setFromObject(car)
    const center = box.getCenter(new THREE.Vector3())
    car.position.x -= center.x
    car.position.z -= center.z
    car.position.y -= box.min.y

    // OBJ 保留了材质槽名（body color / chrome / tyre…），按名字分配材质
    car.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = getCarMaterial(child.name)
      }
    })

    scene.add(car)
  } catch (error) {
    console.error('Failed to load OBJ model:', error)
  }
})
</script>

<style scoped lang="scss">
.car-scene {
  width: 100%;
  height: 100%;
  position: relative;
}

.car-scene__canvas {
  width: 100%;
  height: 100%;
}
</style>
