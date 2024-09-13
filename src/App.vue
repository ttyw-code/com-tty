<script setup lang="ts"></script>

<template>
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

<style scoped>
nav,
main {
  padding: 10px;
  margin-bottom: 10px;
  border: 2px solid #000;
}

nav > a + a {
  margin-left: 10px;
}
</style>
