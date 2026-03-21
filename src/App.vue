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
  <RouterLink class="home-float" to="/home" aria-label="返回主页">
    <svg-icon name="return" width="20px" height="20px" />
  </RouterLink>
  <div class="shortcut-tip">按 Ctrl + K 打开全局搜索</div>
  <Nav v-if="isShowNav"></Nav>
  <main>
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
}

.home-float {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 10000;
  padding: 8px;
  border-radius: 8px;
  background: var(--surface, #ffffff);
  color: var(--text, #0f172a);
  border: 1px solid var(--border, #e2e8f0);
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.18);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.home-float:hover {
  color: var(--primary, #2f54eb);
}

.shortcut-tip {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 11000;
  background: rgba(15, 23, 42, 0.9);
  color: #fff;
  font-size: 0.85rem;
  padding: 6px 10px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  pointer-events: none;
}
</style>
