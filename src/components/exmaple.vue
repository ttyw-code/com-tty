<template>
  <div id="container">this is example page!</div>
  <div>myRef: {{ myRef }}</div>
  <div>myDbRef: {{ db_value }}</div>
  <svg-icon name="window" width="36px" height="36px"></svg-icon>
  <svg-icon name="return" width="36px" height="36px"></svg-icon>
  <div class="user-list">
    <ul>
      <li v-for="(item, index) in users" :key="index">
        <span>{{ index }}</span>
        {{ item.name }} , {{ item.age }}, {{ item.email }}
      </li>
    </ul>
  </div>
  <el-button class="button" type="primary" @click="createAUser">
    postUU
  </el-button>
</template>

<script setup lang="ts">
import request from '@/utils/request'

type USER = {
  name: string
  age: number
  email: string
}

const users = ref<USER[]>([])
users.value = [
  {
    name: '小明',
    age: 18,
    email: '123456@qq.com',
  },
  {
    name: '小白',
    age: 28,
    email: '123456@qq.com',
  },
  {
    name: '小黑',
    age: 18,
    email: '123456@qq.com',
  },
]

async function getUsers() {
  console.log('getUser')
  try {
    const res = await request.get('/get/users')
    if (res && Array.isArray(res.data)) {
      users.value = res.data
    }
  } catch (error) {
    console.error('Error fetching user:')
  }
}

async function createAUser() {
  try {
    const USER = {
      name: 'wei young' + Math.ceil(Math.random() * 100),
      age: 29,
      email: '674268714@qq.com',
    }
    const res = await request.post('api/users', USER)
    console.log('res:', res)
  } catch (error) {
    console.error('Error creating user:')
  }
}

onMounted(() => {
  getUsers()
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
  margin: 120px;
  padding: 10px 20px;
  background-color: var(--primary);
  color: var(--bg);
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.user-list {
  margin: 100px;
  padding: 10px;
  height: fit-content;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 5px;

  ul {
    list-style-type: none;
    padding: 0;

    li {
      margin: 5px 0;
      padding: 5px;
      background-color: var(--bg);
      border: 1px solid var(--border);
      border-radius: 3px;

      span {
        font-weight: bold;
        margin-right: 5px;
        color: var(--primary);
      }
    }
  }
}
</style>
