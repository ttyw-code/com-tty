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
  <RouterLink class="home-float" :to="{ name: 'home' }" aria-label="返回主页">
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
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  text-decoration: none;
  box-shadow: var(--shadow-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.home-float:hover {
  color: var(--accent);
}

.shortcut-tip {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 11000;
  background: var(--surface-2);
  color: var(--muted);
  border: 1px solid var(--border);
  font-size: 0.85rem;
  padding: 6px 10px;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  pointer-events: none;
}
</style>
