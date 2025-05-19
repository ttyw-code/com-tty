<script setup lang="ts"></script>

<template>
  <!-- <el-button type="primary">my button</el-button> -->
  <!-- <svg-icon name="window" width="100px" height="100px"></svg-icon> -->
  <!-- <p>
    <strong>Current route path:</strong>
    {{ $route.fullPath }}
  </p> -->
  <nav class="navbar">
    <RouterLink to="/periodict">Go to periodict</RouterLink>
    <RouterLink to="/other">Go to other</RouterLink>
    <RouterLink to="/home">Go to home</RouterLink>
    <RouterLink to="/login">Go to login</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped lang="scss">
main {
  position: absolute;
  top: 60px;
  display: flex;
  // justify-content: center;
  // align-items: center;
  width: 100vw;
  height: calc(100vh - 60px);
  padding: 1rem;
}

nav {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
.navbar {
  a {
    color: #000;
    text-decoration: none;
    padding: 10px;
    border-radius: 5px;
    &:hover {
      color: skyblue;
    }
  }
}
</style>
