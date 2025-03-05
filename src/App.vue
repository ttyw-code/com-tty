<script setup lang="ts"></script>

<template>
  <el-button type="primary">my button</el-button>
  <svg-icon name="window" width="100px" height="100px"></svg-icon>
  <p>
    <strong>Current route path:</strong>
    {{ $route.fullPath }}
  </p>
  <nav>
    <RouterLink to="/periodict">Go to periodict</RouterLink>
    <RouterLink to="/other">Go to other</RouterLink>
    <RouterLink to="/home">Go to home</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped lang="scss">
nav,
main {
  padding: 10px;
  margin-bottom: 10px;
  border: 2px solid #000;
}

nav > a + a {
  margin-left: 10px;
  color: $color
}
</style>
