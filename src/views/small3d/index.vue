<template>
  <section class="small3d">
    <h2 class="small3d__title">Small 3D Scene（CSG 参数可调）</h2>
    <div class="small3d__control">
      <label>
        Box 尺寸：
        <input
          type="range"
          min="1"
          max="4"
          step="0.05"
          v-model.number="params.boxSize"
        />
        {{ params.boxSize.toFixed(2) }}
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
        {{ params.sphereRadius.toFixed(2) }}
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
        {{ params.offsetX.toFixed(2) }}
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
        {{ params.offsetY.toFixed(2) }}
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
        {{ params.offsetZ.toFixed(2) }}
      </label>
      <label>
        操作：
        <select v-model="params.operation">
          <option value="subtract">Subtract</option>
          <option value="union">Union</option>
          <option value="intersect">Intersect</option>
        </select>
      </label>
    </div>

    <div class="small3d__viewers">
      <div ref="container" class="small3d__canvas"></div>
      <div ref="cesiumContainer" class="small3d__cesium"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, onMounted, reactive, nextTick } from 'vue'
import { useThree } from '@/utils/useThree'
import * as THREE from 'three'
import { CSG } from 'three-csg-ts'
import { loadGLTFModel, loadObjModel } from './3DUtils/loadModel'
import vert from './shader.vert.glsl'
import frag from './shader.frag.glsl'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const container = ref<HTMLElement | null>(null)
const cesiumContainer = ref<HTMLElement | null>(null)
let cesiumViewer: Cesium.Viewer | null = null
const params = reactive({
  boxSize: 2,
  sphereRadius: 1.3,
  offsetX: 0.5,
  offsetY: 0.5,
  offsetZ: 0.5,
  operation: 'subtract' as 'subtract' | 'union' | 'intersect',
})

let sceneRef: THREE.Scene | null = null
const { onReady, onBeforeRender } = useThree(container, {
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

  csgResult.material = new THREE.ShaderMaterial({
    uniforms: { uTime },
    vertexShader: vert,
    fragmentShader: frag,
  })
  csgResult.castShadow = true
  csgResult.receiveShadow = true

  return csgResult
}

const rebuildCSG = () => {
  if (!sceneRef) return
  if (csgMesh) {
    sceneRef.remove(csgMesh)
    csgMesh.geometry.dispose()
    ;(csgMesh.material as THREE.Material).dispose()
    csgMesh = null
  }
  csgMesh = createCSGMesh()
  sceneRef.add(csgMesh)
}

const rotateMatrix = new THREE.Matrix4()
rotateMatrix.makeRotationY(0.01)

const uTime = { value: 0 }

const addR8ToScene = (scene: THREE.Scene) => {
  loadObjModel(`${import.meta.env.BASE_URL}map/audi-r8.obj`)
    .then((obj) => {
      obj.scale.multiplyScalar(0.001)
      obj.position.set(5, 0.1, 0.1)
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.ShaderMaterial({
            uniforms: { uTime },
            vertexShader: vert,
            fragmentShader: frag,
          })
        }
      })
      scene.add(obj)
    })
    .catch((error) => {
      console.error('Failed to load OBJ model:', error)
    })
}

const addTriangleScene = (scene: THREE.Scene) => {
  loadGLTFModel(`${import.meta.env.BASE_URL}map/triangle.gltf`)
    .then((gltf) => {
      gltf.position.set(-2, 0, -2)
      scene.add(gltf)
    })
    .catch((error) => {
      console.error('Failed to load GLTF model:', error)
    })
}

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
  rebuildCSG()
  addR8ToScene(scene)
  addTriangleScene(scene)
})

onBeforeRender(({ elapsed }) => {
  uTime.value = elapsed
  csgMesh?.applyMatrix4(rotateMatrix)
  highlightCube.applyMatrix4(rotateMatrix)
})

onMounted(async () => {
  await nextTick()
  if (cesiumContainer.value) {
    cesiumViewer = new Cesium.Viewer(cesiumContainer.value, {
      timeline: false,
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      navigationHelpButton: false,
      sceneModePicker: false,
      selectionIndicator: false,
      baseLayer: new Cesium.ImageryLayer(
        new Cesium.OpenStreetMapImageryProvider({
          url: 'https://tile.openstreetmap.org/',
        }),
      ),
    })
  }
})

onUnmounted(() => {
  // three 侧资源由 useThree 的 dispose 递归释放
  sceneRef = null
  csgMesh = null
  if (cesiumViewer) {
    cesiumViewer.destroy()
    cesiumViewer = null
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
  width: min(30%, 320px);
  padding: 0.6rem 0.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-sm);
  color: var(--text);
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

.small3d__control input,
.small3d__control select {
  flex: 1;
  min-width: 120px;
}

.small3d__viewers {
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.small3d__canvas,
.small3d__cesium {
  flex: 1;
  border-radius: 0.5rem;
  overflow: hidden;
}

.small3d__canvas {
  background: var(--surface-2);
}

.small3d__cesium {
  background: var(--bg);
}
</style>
