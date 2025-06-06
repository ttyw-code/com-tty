<template>
  <div id="container">this is example page!</div>
  <div>myRef: {{ myRef }}</div>
  <div>myDbRef: {{ db_value }}</div>
  <el-button class="button" type="primary" @click="postUU">post</el-button>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import request from '../utils/request'

function changeValue() {
  setTimeout(() => {
    myRef.value = Math.ceil(Math.random() * 100)
  }, 10000)
}

function postUU() {
  console.log('postUser')
  request
    .post('api/users', {
      name: 'John Doe',
      age: 30,
    })
    .then(() => {
      console.log('User created:')
    })
    .catch(() => {
      console.error('Error creating user:')
    })
}

onMounted(() => {
  changeValue()
  ;(function () {
    const path = 'http://localhost:3000/api/users/123'
    const catPath = path.replace(/\/api/, '')
    console.log('catPath: ', catPath)
  })()
})

const myRef = ref(0)
watch(myRef, (newValue, oldValue) => {
  console.log(`myRef changed from ${oldValue} to ${newValue}`)
})

const db_value = computed(() => {
  return myRef.value * 2
})
</script>

<style scoped lang="scss">
#container {
  margin: 0;
}

.button {
  margin: 10px;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
