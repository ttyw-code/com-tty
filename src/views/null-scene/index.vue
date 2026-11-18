<template>
  <div class="null-scene" ref="nullscene"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
const nullscene = ref<HTMLElement | null>(null)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
)
const renderer = new THREE.WebGLRenderer()
camera.position.z = 4
const geometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

const light = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(light)

onMounted(() => {
  if (nullscene.value) {
    renderer.setSize(nullscene.value.clientWidth, nullscene.value.clientHeight)
    nullscene.value.appendChild(renderer.domElement)
  }
  renderer.render(scene, camera)
})
</script>

<style scoped>
.null-scene {
  position: relative;
  margin: auto;
  width: 80%;
  height: 80%;
}
</style>
