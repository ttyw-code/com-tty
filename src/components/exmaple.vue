<template>
  <div id="container">this is example page!</div>
  <div>myRef: {{ myRef }}</div>
  <div>myDbRef: {{ db_value }}</div>
  <div class="user-list">
    <ul>
      <li v-for="(item, index) in users" :key="index">
        <span>{{ index }}</span>
        {{ item.name }} , {{ item.age }}, {{ item.email }}
      </li>
    </ul>
  </div>
  <el-button class="button" type="primary" @click="postUU">postUU</el-button>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import request from '../utils/request'

// function changeValue() {
//   setTimeout(() => {
//     myRef.value = Math.ceil(Math.random() * 100)
//   }, 10000)
// }

const users = ref(
  [] as Array<{
    name: string
    age: number
    email: string
  }>,
)

function getUU() {
  console.log('getUser')
  request
    .get('api/users')
    .then((res) => {
      console.log('User fetched:', res)
      if (res && Array.isArray(res.data)) {
        users.value = res.data as Array<{
          name: string
          age: number
          email: string
        }>
      }
    })
    .catch(() => {
      console.error('Error fetching user:')
    })
}

function postUU() {
  console.log('postUser')
  request
    .post('api/users', {
      name: 'wei young' + Math.ceil(Math.random() * 100),
      age: 29,
      email: '674268714@qq.com',
    })
    .then(() => {
      console.log('User created:')
      getUU()
    })
    .catch(() => {
      console.error('Error creating user:')
    })
}

onMounted(() => {
  // getUU()
  // changeValue()
  // ;(function () {
  //   const path = 'http://localhost:3000/api/users/123'
  //   const catPath = path.replace(/\/api/, '')
  //   console.log('catPath: ', catPath)
  // })()
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

.user-list {
  margin: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;

  ul {
    list-style-type: none;
    padding: 0;

    li {
      margin: 5px 0;
      padding: 5px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 3px;
      span {
        font-weight: bold;
        margin-right: 5px;
        color: #42b983;
      }
    }
  }
}
</style>
