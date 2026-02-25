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
import { createElement } from '@/common/dom'
import vertexShader from './shader.vert.glsl'
import fragmentShader from './shader.frag.glsl'

const container = ref<HTMLElement | null>(null)
const canvasElement = createElement('canvas')
container.value?.appendChild(canvasElement)
const { scene, camera } = useThree(container, {
  bgColor: 0x20232a,
  showAxes: true,
  cameraPosition: { x: 5, y: 5, z: 5 },
})

// 3. 使用 ShaderMaterial 替换你原来的 MeshStandardMaterial
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    uTime: { value: 0.0 }, // 定义一个时间变量传给 GLSL
  },
})

const geometry = new THREE.BoxGeometry(1, 1, 1)

const cube = new THREE.Mesh(geometry, material)

onMounted(async () => {
  await nextTick()
  console.log('camera projectionMatrix:', camera.value!.projectionMatrix)
  console.log('scene :', scene.value)
})

// 4. 如果你想让颜色动起来，可以在你的 setInterval 或 requestAnimationFrame 中更新 uTime
let time = 0
setInterval(() => {
  time += 0.05
  material.uniforms.uTime.value = time
}, 16)

const rotateMatrix = new THREE.Matrix4()
rotateMatrix.set(
  Math.cos(0.1),
  0,
  Math.sin(0.1),
  0,
  0,
  1,
  0,
  0,
  -Math.sin(0.1),
  0,
  Math.cos(0.1),
  0,
  0,
  0,
  0,
  1,
)
const scaleMatrix = new THREE.Matrix4()
scaleMatrix.set(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1)
const translateMatrix = new THREE.Matrix4()
translateMatrix.set(1, 0, 0, 2, 0, 1, 0, 2, 0, 0, 1, 2, 0, 0, 0, 1)
// setInterval(() => {
//   cube.applyMatrix4(rotateMatrix)
// }, 16)
// 大约每16毫秒旋转一次，相当于60FPS
// cube.applyMatrix4(rotateMatrix);

setInterval(() => {
  // cube.applyMatrix4(translateMatrix);
}, 2000)

// const v1 = new THREE.Vector3(1, 0, 0)
// const v2 = new THREE.Vector3(2, 0, 2)

// const v3 = v1.clone().add(v2) // v3 现在是 (3, 3, 3)
// const v4 = v1.clone().cross(v2) // v4 现在是 (2, 0, 0)
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
