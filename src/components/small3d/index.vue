<template>
  <section class="small3d">
    <h2 class="small3d__title">Small 3D Scene</h2>
    <div ref="container" class="small3d__canvas"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useThree } from '@/utils/3D'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { createElement } from '@/common/dom'

const container = ref<HTMLElement | null>(null)
const canvasEl = createElement('canvas')
container.value?.appendChild(canvasEl)
const { scene } = useThree(container, {
  bgColor: 0x20232a,
  showAxes: true,
  cameraPosition: { x: 5, y: 5, z: 5 },
})

// 使用 RoundedBoxGeometry 创建带有倒角的立方体
// 参数: width, height, depth, segments, radius
const geometry = new RoundedBoxGeometry(1, 1, 1, 4, 0.1)

// 使用 MeshStandardMaterial 以支持光照和高光
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  roughness: 0.2, // 粗糙度越低，高光越明显
  metalness: 0.1, // 金属度
})
const cube = new THREE.Mesh(geometry, material)

const rotateMatrix = new THREE.Matrix4()
rotateMatrix.set(
  Math.cos(0.01),
  0,
  Math.sin(0.01),
  0,
  0,
  1,
  0,
  0,
  -Math.sin(0.01),
  0,
  Math.cos(0.01),
  0,
  0,
  0,
  0,
  1,
)

// Use the animation loop from useThree instead of setInterval
const animateCube = () => {
  cube.applyMatrix4(rotateMatrix)
  requestAnimationFrame(animateCube)
}

// 添加灯光以显示高光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4) // 环境光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1) // 平行光
directionalLight.position.set(5, 15, 7)

watch(
  () => scene.value,
  (newScene) => {
    if (newScene) {
      newScene.add(ambientLight)
      newScene.add(directionalLight)
      newScene.add(cube)
      animateCube()
    }
  },
)
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
