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

    <div class="small3d__viewers">
      <div ref="container" class="small3d__canvas"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { useThree } from '@/utils/3DUtils/useThree'
import {
  createGridMaterial,
  csgBoxMaterial,
  csgSphereMaterial,
  highlightMaterial,
} from '@/utils/3DUtils/threeMaterials'
import * as THREE from 'three'
import { CSG } from 'three-csg-ts'

type CSGOperationType = 'subtract' | 'union' | 'intersect'
interface CSGParams {
  boxSize: number
  sphereRadius: number
  offsetX: number
  offsetY: number
  offsetZ: number
  operation: CSGOperationType
}
const container = ref<HTMLElement | null>(null)
const params = reactive<CSGParams>({
  boxSize: 2,
  sphereRadius: 1.3,
  offsetX: 0.5,
  offsetY: 0.5,
  offsetZ: 0.5,
  operation: 'subtract',
})

let sceneRef: THREE.Scene | null = null
const { onReady, onBeforeRender } = useThree(container, {
  bgColor: 0x20232a,
  showAxes: true,
  cameraPosition: { x: 5, y: 5, z: 5 },
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

/**
 * 参考网格：每格 1 个单位，平面铺到 300×300（半径 150），远超视野范围。
 * 下移到 CSG 立方体底面（y = -1）当"地面"。
 * 尺寸必须大于雾的 far（120），否则会看到网格边界在半空中突然截断。
 */
const GRID_SIZE = 300
const GRID_Y = -1

/** 雾与场景底色一致：远处网格融进背景，像无限延伸的地面 */
const SCENE_FOG = { color: 0x20232a, near: 40, far: 120 }

let csgMesh: THREE.Mesh | null = null
const createCSGMesh = () => {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(params.boxSize, params.boxSize, params.boxSize),
    csgBoxMaterial,
  )
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(params.sphereRadius, 48, 48),
    csgSphereMaterial,
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

  return csgResult
}

const rebuildCSG = () => {
  if (!sceneRef) return
  if (csgMesh) {
    sceneRef.remove(csgMesh)
    // 只释放几何体。材质是 threeMaterials 里导出的公共实例，
    // 在这里 dispose 会把它从所有引用它的 Mesh 上一起抽走
    csgMesh.geometry.dispose()
    csgMesh = null
  }
  csgMesh = createCSGMesh()
  sceneRef.add(csgMesh)
}

const rotateMatrix = new THREE.Matrix4()
rotateMatrix.makeRotationX(0.01)

watch(
  () => params,
  () => {
    rebuildCSG()
  },
  { deep: true },
)

onReady(({ scene }) => {
  sceneRef = scene

  scene.add(ambientLight)
  scene.add(directionalLight)
  scene.add(highlightCube)

  // 格子平面：PlaneGeometry 默认躺在 XY 平面，绕 X 轴转 -90° 放平到 XZ
  const grid = new THREE.Mesh(
    new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE),
    createGridMaterial(GRID_SIZE),
  )
  grid.rotation.x = -Math.PI / 2
  grid.position.y = GRID_Y
  scene.add(grid)

  // 雾与背景同色：mipmap 已经把远处网格糊开，雾负责让最远处彻底融进底色
  scene.fog = new THREE.Fog(SCENE_FOG.color, SCENE_FOG.near, SCENE_FOG.far)

  rebuildCSG()
})

onBeforeRender(() => {
  csgMesh?.applyMatrix4(rotateMatrix)
  highlightCube.applyMatrix4(rotateMatrix)
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
  background: var(--bg);
  color: var(--text);
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
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-sm);
  color: var(--text);
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
  color: var(--text-2);
}

.small3d__control input,
.small3d__control select {
  color: var(--text);
  accent-color: var(--text-2);
}

.small3d__control input[type='range'] {
  background: transparent;
  border: none;
  padding: 0;
}

.small3d__control select {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  padding: 0.15rem 0.3rem;
}

.small3d__control button {
  color: var(--on-primary);
  background: var(--primary);
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
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

.small3d__viewers {
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
}

.small3d__canvas {
  flex: 1;
  border-radius: 0.5rem;
  overflow: hidden;
  background: var(--surface-2);
}
</style>
