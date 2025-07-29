<script setup lang="ts">
import Nav from '@/components/nav/index.vue'
</script>

<template>
  <Nav></Nav>

  <main>
    <RouterView />
  </main>
</template>

<style scoped lang="scss">
main {
  position: absolute;
  inset: 0;
  display: flex;
  background-color: #1f1d1d;
}
</style>
