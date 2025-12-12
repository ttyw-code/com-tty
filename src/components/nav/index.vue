<template>
  <div>
    <header class="site-header">
      <nav class="site-header__nav">
        <div id="site-header__nav-bg"></div>
        <RouterLink to="/home">Home</RouterLink>
        <RouterLink to="/periodict">Periodict</RouterLink>
        <RouterLink to="/aspectRatio">Other</RouterLink>
        <RouterLink to="/example">Example</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/task">Task</RouterLink>
        <RouterLink to="/small3d">Small3d</RouterLink>
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import theme, { toggleTheme, getTheme } from '../../utils/theme'

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
  color: var(--text);

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
    box-shadow:
      0 18px 45px rgba(15, 23, 42, 0.18),
      0 3px 12px rgba(15, 23, 42, 0.12);
  }
}

[data-theme='dark'] .site-header__nav #site-header__nav-bg {
  background: rgba(17, 24, 39, 0.88);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow:
    0 18px 42px rgba(2, 6, 23, 0.65),
    0 4px 10px rgba(2, 6, 23, 0.42);
}

.site-header {
  a {
    text-decoration: none;
    padding: 10px;
    color: inherit;
    mix-blend-mode: normal;
    transition: color 160ms ease;
    &:hover {
      color: var(--primary);
    }
  }
}

[data-theme='dark'] .site-header {
  a {
    color: rgba(226, 232, 240, 0.92);
  }
}

.theme-toggle {
  margin-left: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
  padding: 6px 8px;
  border-radius: 6px;
  width: 40px;
  height: 36px;
}
.theme-toggle svg {
  display: block;
}
.theme-toggle .icon-moon,
.theme-toggle .icon-sun {
  display: inline-flex;
}
</style>
