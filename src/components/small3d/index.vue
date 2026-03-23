<template>
  <section class="small3d">
    <div class="small3d__control">
      <div class="small3d__control-title">操作</div>
      <label>
        Box 尺寸：
        <input
          type="range"
          min="1"
          max="4"
          step="0.05"
          v-model.number="params.boxSize"
        />
        <input
          type="number"
          min="1"
          max="4"
          step="0.05"
          v-model.number="params.boxSize"
          class="small3d__value-input"
        />
      </label>
      <label>
        Sphere 半径：
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.05"
          v-model.number="params.sphereRadius"
        />
        <input
          type="number"
          min="0.5"
          max="3"
          step="0.05"
          v-model.number="params.sphereRadius"
          class="small3d__value-input"
        />
      </label>
      <label>
        Offset X：
        <input
          type="range"
          min="-2"
          max="2"
          step="0.05"
          v-model.number="params.offsetX"
        />
        <input
          type="number"
          min="-2"
          max="2"
          step="0.05"
          v-model.number="params.offsetX"
          class="small3d__value-input"
        />
      </label>
      <label>
        Offset Y：
        <input
          type="range"
          min="-2"
          max="2"
          step="0.05"
          v-model.number="params.offsetY"
        />
        <input
          type="number"
          min="-2"
          max="2"
          step="0.05"
          v-model.number="params.offsetY"
          class="small3d__value-input"
        />
      </label>
      <label>
        Offset Z：
        <input
          type="range"
          min="-2"
          max="2"
          step="0.05"
          v-model.number="params.offsetZ"
        />
        <input
          type="number"
          min="-2"
          max="2"
          step="0.05"
          v-model.number="params.offsetZ"
          class="small3d__value-input"
        />
      </label>
      <div class="small3d__operation-radios">
        <label>
          <input type="radio" value="subtract" v-model="params.operation" />
          Subtract
        </label>
        <label>
          <input type="radio" value="union" v-model="params.operation" />
          Union
        </label>
        <label>
          <input type="radio" value="intersect" v-model="params.operation" />
          Intersect
        </label>
      </div>
    </div>

    <div ref="container" class="small3d__canvas"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, onMounted, reactive, nextTick } from 'vue'
import { useThree } from '@/utils/use3DSence'
import * as THREE from 'three'
import { CSG } from 'three-csg-ts'
import { createElement } from '@/common/dom'

const container = ref<HTMLElement | null>(null)
const params = reactive({
  boxSize: 2,
  sphereRadius: 1.3,
  offsetX: 0.5,
  offsetY: 0.5,
  offsetZ: 0.5,
  operation: 'subtract' as 'subtract' | 'union' | 'intersect',
})

const canvasElement = createElement('canvas')
container.value?.appendChild(canvasElement)
const { scene, camera } = useThree(container, {
  bgColor: 0x20232a,
  showAxes: true,
  cameraPosition: { x: 5, y: 5, z: 5 },
})

const highlightMaterial = new THREE.MeshStandardMaterial({
  color: 0x8a9fff,
  metalness: 0.1,
  roughness: 0.4,
})
const highlightCube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  highlightMaterial,
)
highlightCube.position.set(0, 0, 0)

const lightColor = 0xffffff
const ambientLight = new THREE.AmbientLight(lightColor, 0.4)
const directionalLight = new THREE.DirectionalLight(lightColor, 1)
directionalLight.position.set(5, 15, 7)

let csgMesh: THREE.Mesh | null = null
const createCSGMesh = () => {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(params.boxSize, params.boxSize, params.boxSize),
    new THREE.MeshStandardMaterial({
      color: 0x2f54eb,
      metalness: 0.2,
      roughness: 0.5,
    }),
  )
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(params.sphereRadius, 48, 48),
    new THREE.MeshStandardMaterial({
      color: 0xffbb55,
      metalness: 0.2,
      roughness: 0.5,
    }),
  )
  sphere.position.set(params.offsetX, params.offsetY, params.offsetZ)

  let csgResult: THREE.Mesh
  if (params.operation === 'subtract') {
    csgResult = CSG.subtract(box, sphere)
  } else if (params.operation === 'union') {
    csgResult = CSG.union(box, sphere)
  } else {
    csgResult = CSG.intersect(box, sphere)
  }

  csgResult.material = new THREE.MeshStandardMaterial({
    color: 0x44cc88,
    metalness: 0.3,
    roughness: 0.4,
  })
  csgResult.castShadow = true
  csgResult.receiveShadow = true

  return csgResult
}

const rebuildCSG = () => {
  if (scene.value) {
    if (csgMesh) {
      scene.value.remove(csgMesh)
      csgMesh.geometry.dispose()
      ;(csgMesh.material as THREE.Material).dispose()
      csgMesh = null
    }
    csgMesh = createCSGMesh()
    scene.value.add(csgMesh)
  }
}

const rotateMatrix = new THREE.Matrix4()
rotateMatrix.makeRotationY(0.01)

let animationFrameId: number | null = null
const animate = () => {
  csgMesh?.applyMatrix4(rotateMatrix)
  highlightCube.applyMatrix4(rotateMatrix)
  animationFrameId = requestAnimationFrame(animate)
}

watch(
  () => params,
  () => {
    rebuildCSG()
  },
  { deep: true },
)

watch(
  () => scene.value,
  (newScene) => {
    if (newScene) {
      newScene.add(ambientLight)
      newScene.add(directionalLight)
      newScene.add(highlightCube)
      rebuildCSG()
      animate()
    }
  },
)

onMounted(async () => {
  await nextTick()
  console.log('camera projectionMatrix:', camera.value?.projectionMatrix)
  console.log('scene :', scene.value)
})

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
  if (csgMesh && scene.value) {
    scene.value.remove(csgMesh)
    csgMesh.geometry.dispose()
    ;(csgMesh.material as THREE.Material).dispose()
    csgMesh = null
  }
  if (scene.value) {
    scene.value.remove(highlightCube)
    scene.value.remove(ambientLight)
    scene.value.remove(directionalLight)
  }
})
</script>

<style scoped>
.small3d {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #101420;
  color: #fff;
  border-radius: 0.75rem;
  position: relative;
}

.small3d__title {
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.125rem;
  z-index: 1;
}

.small3d__control {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 2;
  display: grid;
  gap: 0.35rem;
  width: min(30%, 340px);
  padding: 0.6rem 0.75rem;
  background: rgba(5, 8, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
}

.small3d__control-title {
  font-size: 0.95rem;
  color: #a1caff;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.24);
  padding-bottom: 0.35rem;
  margin-bottom: 0.2rem;
}

.small3d__control label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #d6e4ff;
}

.small3d__control input[type='range'] {
  flex: 1;
}

.small3d__value-input {
  width: 5rem;
  min-width: 4.2rem;
  padding: 0.1rem 0.2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #fff;
  border-radius: 0.2rem;
}

.small3d__operation-radios {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.3rem;
  font-size: 0.8rem;
}

.small3d__operation-radios label {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  cursor: pointer;
}

.small3d__canvas {
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: #20232a;
  border-radius: 0.5rem;
  overflow: hidden;
}
</style>
<style scoped>
.small3d {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #101420;
  color: #fff;
  border-radius: 0.75rem;
  position: relative;
}

.small3d__title {
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.125rem;
  z-index: 1;
}

.small3d__canvas {
  width: 100%;
  height: 100%;
  min-height: 400px;
  /* 给一个最小高度确保显示 */
  background: #20232a;
  border-radius: 0.5rem;
  overflow: hidden;
}
</style>
