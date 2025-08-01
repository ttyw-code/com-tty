<template>
  <div id="home">
    <h1>
      this is a home page
      <br />
    </h1>
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  // This is where you can add any setup logic that needs to run when the component is mounted
  console.log('Home component mounted')
})
</script>

<style scoped lang="scss">
#home {
  position: absolute;
  height: 3000px;
  left: 0;
  right: 0;
}
</style>
