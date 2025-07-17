<template name="example">
  <div class="login-container">
    <div class="login-title">LOGIN</div>
    <div class="login-form">
      <div class="login-form-item">
        <!-- <label for="username">Username</label> -->
        <el-input
          class="input"
          type="text"
          id="username"
          placeholder="电子邮件或电话号码"
          v-model="username"
        />
      </div>
      <div class="login-form-item">
        <!-- <label for="password">Password</label> -->
        <el-input
          class="input"
          type="password"
          id="password"
          placeholder="密码"
          v-model="password"
        />
      </div>
      <div class="login-form-item">
        <el-checkbox class="rememberPwd" v-model="rememberPwd">
          记住密码
        </el-checkbox>
      </div>
      <div class="login-form-item">
        <el-button class="login-bt" type="primary">登录</el-button>
        <el-button class="login-bt" type="primary">注册</el-button>
        <el-button class="login-bt" type="primary">忘记密码</el-button>
      </div>
      <div class="login-form-item">
        <div class="login-protocol">
          <p>
            <el-checkbox v-model="isAgree"></el-checkbox>
            阅读并同意
            <a href="">《服务协议》</a>
            和
            <a href="">《隐私政策》</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const rememberPwd = ref(false)
const isAgree = ref(false)
const username = ref('')
const password = ref('')

onMounted(() => {})
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
.login-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2.5rem;
}

.login-form-item {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  .input {
    height: 56px;
    width: 480px;
    font-size: 1.3rem;
    :deep(.el-input__wrapper) {
      border-radius: 15px;
    }
  }
  .login-bt {
    width: 100px;
    height: 48px;
    font-size: 1.1rem;
    border-radius: 15px;
    background-color: rgb(121.3, 187.1, 255);
    color: #f5f5f5;
    transition: all 0.3s;
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
  }
  &:nth-of-type(3) {
    justify-content: flex-end;
  }
  &:nth-last-of-type(1) {
    margin-top: 3rem;
  }
}
.login-protocol {
  a {
    color: #409eff;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
