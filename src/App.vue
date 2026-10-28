<script setup lang="ts">
import Nav from '@/components/nav/index.vue'
import GlobalSearch from '@/components/GlobalSearch/index.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isShowNav = computed(() => {
  return !route.meta.hideNav
})
</script>

<template>
  <RouterLink
    v-if="!isShowNav"
    class="home-back"
    :to="{ name: 'home' }"
    aria-label="返回主页"
  >
    <svg-icon name="return" width="20px" height="20px" />
  </RouterLink>
  <Nav v-if="isShowNav"></Nav>
  <main :class="{ 'has-nav': isShowNav }">
    <RouterView />
  </main>
  <GlobalSearch />
</template>

<style scoped lang="scss">
main {
  position: absolute;
  inset: 0;
  display: flex;
  overflow: auto;

  // 导航是 fixed 覆盖层，顶部态还是透明的：给内容让出导航高度，避免首屏被压住。
  // hideNav 的沉浸式页面（/small3d /car /cesium）不补，否则画面会少一截
  &.has-nav {
    padding-top: 64px;
  }
}

.home-back {
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 8px;
  z-index: 10;
  border-radius: 8px;
  border: 1px solid var(--border);
  text-decoration: none;
  box-shadow: var(--shadow-sm);
  transition: 0.2s all;
  // 与导航里的主题切换图标同色
  color: var(--muted);
}

.home-back:hover {
  scale: 1.1;
}
</style>
