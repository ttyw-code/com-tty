<template>
  <div>
    <header class="site-header">
      <nav class="site-header__nav">
        <div id="site-header__nav-bg"></div>
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
        >
          {{ item.label }}
        </RouterLink>
        <!-- 主题切换与返回：整组靠导航栏右侧 -->
        <div class="site-header__actions">
          <!-- 主题切换按钮：图标取自 src/assets/icons 下的 light.svg / dark.svg（图标名与主题名一致） -->
          <button
            class="theme-toggle"
            @click="onToggle"
            :aria-label="ariaLabel"
            title="切换主题"
          >
            <svg-icon :name="current" width="16px" height="16px" />
          </button>
          <RouterLink class="back" :to="{ name: 'home' }" aria-label="返回主页">
            <svg-icon name="return" width="20px" height="20px" />
          </RouterLink>
        </div>
      </nav>
    </header>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import theme, { toggleTheme, getTheme } from '@/utils/theme'
import { router } from '@/router'

// 导航项直接由路由表派生：加路由即加导航，不用两处维护
const navItems = computed(() =>
  router.options.routes
    .filter((route) => route.meta?.nav && route.name)
    .map((route) => ({
      name: route.name as string,
      label: route.meta?.title ?? String(route.name),
    })),
)

const current = ref<'light' | 'dark'>(getTheme())
const ariaLabel = ref(
  current.value === 'dark' ? '切换至亮色主题' : '切换至暗色主题',
)

function onToggle() {
  const next = toggleTheme()
  current.value = next
  ariaLabel.value = next === 'dark' ? '切换至亮色主题' : '切换至暗色主题'
}

// subscribe to theme changes in case other parts change it
let off: (() => void) | null = null
onMounted(() => {
  off = theme.onThemeChange((t) => {
    current.value = t
    ariaLabel.value = t === 'dark' ? '切换至亮色主题' : '切换至暗色主题'
  })
})
onBeforeUnmount(() => {
  if (off) off()
})
</script>

<style scoped lang="scss">
.site-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  padding: 0.3vh;
  top: 4vh;
  left: 0;
  right: 0;
  z-index: 9999;
}

.site-header__nav {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.4vw;
  height: 60px;
  margin: 0 3vw;
  color: var(--muted);

  #site-header__nav-bg {
    position: absolute;
    inset: 0;
    z-index: -1;
    transform: translateZ(0);
    border-radius: calc(2rem + 15px);
    height: 100%;
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }
}

// 主题切换 + 返回主页：margin-left: auto 把整组推到导航栏最右侧
.site-header__actions {
  margin-left: auto;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.site-header {
  a {
    text-decoration: none;
    padding: 10px;
    color: inherit;
    mix-blend-mode: normal;
    transition: color 160ms ease;

    &:hover {
      color: var(--accent);
    }
  }
}

.theme-toggle {
  color: var(--muted);
  padding: 6px 8px;
  border-radius: 6px;
  width: 40px;
  height: 36px;
  transition: 160ms all;
}

.theme-toggle:hover,
.back:hover {
  scale: 1.2;
}
</style>
