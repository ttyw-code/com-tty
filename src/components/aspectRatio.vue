<template>
  <div class="outer-container">
    <div class="inner-container">
      <div class="content">
        <h1>保持宽高固定比例解决方案</h1>
        <h2>x:{{ x }},y:{{ y }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMouse } from '@/utils/catchMouse'

const { x, y } = useMouse()

onMounted(() => {})
</script>

<style scoped lang="scss">
.outer-container {
  width: 50%;
  margin: auto;
  //  aspect-ratio: 16/9;
  background-color: red;
}
.inner-container {
  width: 100%;
  padding-top: 56.25%;
  position: relative;
}
.content {
  position: absolute;
  inset: 0;
  background-color: #efefef;
  h1 {
    text-align: center;
    padding-top: 15%;
  }
  h2 {
    text-align: center;
    padding-top: 5%;
  }
}
</style>
