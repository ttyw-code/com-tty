<template>
  <section class="flotation-scene">
    <div ref="container" class="flotation-scene__canvas"></div>
    <p v-if="status === 'loading'" class="flotation-scene__tip">模型加载中…</p>
    <p v-else-if="status === 'error'" class="flotation-scene__tip is-error">
      模型加载失败，详见控制台
    </p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { useThree } from '@/utils/3DUtils/useThree'
import { createGridMaterial } from '@/utils/3DUtils/threeMaterials'
import { loadModel } from '@/utils/3DUtils/loadModel'
import { createLiquidSurface, type LiquidSurface } from './liquid'
import { createBubbles, type BubbleField } from './bubbles'

const BG_COLOR = 0x15171c
const MODEL_URL = `${import.meta.env.BASE_URL}3dModel/flotation_cell.glb`

/** 相机按包围盒重算前的占位值，保证首帧不是空的 */
const FALLBACK_CAMERA = { x: 6, y: 4, z: 8 }

const container = ref<HTMLElement | null>(null)
const status = ref<'loading' | 'ready' | 'error'>('loading')

// 动画对象在模型加载完成后才有，用可空引用让 onBeforeRender 每帧安全取用
let liquid: LiquidSurface | null = null
let bubbles: BubbleField | null = null

const { onReady, onBeforeRender } = useThree(container, {
  bgColor: BG_COLOR,
  cameraPosition: FALLBACK_CAMERA,
})

onReady(async ({ scene, camera, renderer, controls }) => {
  // 金属材质靠环境反射，没有 envMap 时 metalness 越高越接近纯黑
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()

  scene.add(new THREE.AmbientLight(0xffffff, 0.45))
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.8)
  keyLight.position.set(6, 10, 8)
  scene.add(keyLight)
  // 背侧补光：机器是深灰金属，只有主光时背光面会糊成一片黑
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.5)
  fillLight.position.set(-8, 4, -6)
  scene.add(fillLight)

  try {
    const model = await loadModel(MODEL_URL)

    // 模型自带一块 60×60 的「地坪」平面：既会盖住场景网格，
    // 也会把包围盒撑到 60 米，让相机被迫退到很远。先摘掉，用我们自己的网格当地面
    model.getObjectByName('地坪')?.removeFromParent()

    // 槽体顶部还有一块不透明的「槽口盖板」（M_槽口盖板），把槽口整个封死，
    // 液面和气泡会被完全挡住。这里只隐藏这块盖板，槽壁和上方玻璃盖板都保留
    model.getObjectByName('槽体')?.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material]
      if (materials.some((material) => material.name === 'M_槽口盖板')) {
        child.visible = false
      }
    })

    // 观察窗原本是不透明的（M_观察窗 是近黑的实体材质），从外面完全看不到槽内。
    // 改成半透明玻璃后，液面和上升的气泡就能透过观察窗看见
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      const material = child.material as THREE.Material
      if (material?.name !== 'M_观察窗') return

      // clone 一份再改，避免影响其它复用同一材质的网格
      const glass = material.clone()
      glass.transparent = true
      glass.opacity = 0.28
      // 半透明物体不写深度，否则会把后面的液面和气泡挡掉
      glass.depthWrite = false
      child.material = glass
    })

    // 再量真实尺寸，据此决定归位、网格和机位 —— 换模型不用重新调参数
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1

    // 水平居中、底面贴地（y = 0）
    model.position.x -= center.x
    model.position.z -= center.z
    model.position.y -= box.min.y
    scene.add(model)

    // 模型自带 `槽内液面` 节点（y≈1.72，2.15×1.31），直接换材质，不重建几何体
    const liquidMesh = model.getObjectByName('槽内液面')
    if (liquidMesh instanceof THREE.Mesh) {
      liquid = createLiquidSurface(liquidMesh)
    }

    // 气泡范围取自真实几何：水平用液面尺寸，高度从槽底到液面
    const tank = model.getObjectByName('槽体')
    const surfaceBox = new THREE.Box3().setFromObject(liquidMesh ?? model)
    const tankBox = tank ? new THREE.Box3().setFromObject(tank) : null
    const surfaceCenter = surfaceBox.getCenter(new THREE.Vector3())
    const surfaceSize = surfaceBox.getSize(new THREE.Vector3())

    bubbles = createBubbles({
      count: 50,
      // 0.42 而不是 0.5：留出边缘余量，气泡不会贴着槽壁生成
      radiusX: surfaceSize.x * 0.42,
      radiusZ: surfaceSize.z * 0.42,
      bottomY: (tankBox?.min.y ?? surfaceBox.min.y - 0.8) + 0.05,
      topY: surfaceBox.max.y - 0.01,
    })
    // 气泡的 x/z 是以槽中心为原点的局部坐标，整体挪到液面正下方
    bubbles.points.position.set(surfaceCenter.x, 0, surfaceCenter.z)
    scene.add(bubbles.points)

    // 网格铺到 20 倍模型尺寸，远处交给同色雾淡出，看不到边界
    const gridSize = maxDim * 20
    const grid = new THREE.Mesh(
      new THREE.PlaneGeometry(gridSize, gridSize),
      createGridMaterial(gridSize, { cell: maxDim / 5 }),
    )
    grid.rotation.x = -Math.PI / 2
    // 下沉一点，避免和模型底面的共面 z-fighting
    grid.position.y = -maxDim * 0.002
    scene.add(grid)
    scene.fog = new THREE.Fog(BG_COLOR, maxDim * 3, maxDim * 12)

    // 按 fov 反算能装下模型的距离，贴近一些让槽口细节看得清
    if (camera instanceof THREE.PerspectiveCamera) {
      const fitDist =
        maxDim / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)
      const dist = fitDist * 1.0

      // 斜前上方 45°，水平距离与高度各占一部分
      camera.position.set(dist * 0.72, maxDim * 0.65, dist * 0.72)
      camera.near = maxDim / 100
      camera.far = maxDim * 100
      camera.updateProjectionMatrix()

      if (controls) {
        controls.target.set(0, size.y / 2, 0)
        controls.minDistance = maxDim * 0.3
        controls.maxDistance = maxDim * 8
        controls.update()
      }
    }

    status.value = 'ready'
  } catch (error) {
    status.value = 'error'
    console.error('Failed to load flotation cell model:', error)
  }
})

// 所有动画只在这里推进：液面噪声滚动 + 气泡上升，都是 uTime 驱动的纯 GPU 动画
onBeforeRender(({ elapsed, camera, renderer }) => {
  liquid?.update(elapsed)
  if (!bubbles) return

  // gl_PointSize 的单位是设备像素，要把"世界尺寸"换算过去：
  // 画布高度 / (2·tan(半视角))，再用它除以 -mvPosition.z 得到透视大小
  const viewHeight = renderer.domElement.height
  const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 50
  const sizeScale =
    viewHeight / (2 * Math.tan(THREE.MathUtils.degToRad(fov) / 2))

  bubbles.update(elapsed, sizeScale)
})
</script>

<style scoped lang="scss">
.flotation-scene {
  position: relative;
  width: 100%;
  height: 100%;
}

.flotation-scene__canvas {
  width: 100%;
  height: 100%;
}

.flotation-scene__tip {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  margin: 0;
  padding: 0.4rem 0.8rem;
  color: var(--muted);
  font-size: 0.85rem;
  border-radius: 0.5rem;
  background: var(--surface);
  border: 1px solid var(--border);

  &.is-error {
    color: var(--danger);
  }
}
</style>
