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
        <!-- 主题切换按钮 -->
        <button
          class="theme-toggle"
          @click="onToggle"
          :aria-label="ariaLabel"
          title="切换主题"
        >
          <span v-if="current === 'light'" class="icon-sun" aria-hidden="true">
            <!-- sun icon -->
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4V2"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 22v-2"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.93 4.93L3.51 3.51"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M20.49 20.49l-1.42-1.42"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 12H4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M20 12h2"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.93 19.07L3.51 20.49"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M20.49 3.51l-1.42 1.42"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span v-else class="icon-moon" aria-hidden="true">
            <!-- moon icon -->
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </button>
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
  margin-left: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
  padding: 6px 8px;
  border-radius: 6px;
  width: 40px;
  height: 36px;
  transition:
    color 160ms ease,
    background-color 160ms ease;
}

.theme-toggle:hover {
  color: var(--accent);
  background: var(--surface-2);
}
.theme-toggle svg {
  display: block;
}
.theme-toggle .icon-moon,
.theme-toggle .icon-sun {
  display: inline-flex;
}
</style>
