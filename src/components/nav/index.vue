<template>
  <div>
    <header class="site-header" :class="{ 'is-scrolled': scrolled }">
      <nav class="site-header__nav">
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
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
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

/**
 * 滚动状态：顶部时通栏贴边、无边框；向下滚动后收成浮动胶囊。
 * 注意滚动容器是 App.vue 里的 <main>（position: absolute; overflow: auto），
 * 不是 window —— 监听必须挂在 main 上，window.scrollY 永远是 0。
 */
const scrolled = ref(false)
let scroller: HTMLElement | null = null
let rafId = 0

const readScroll = () => {
  const top = scroller?.scrollTop ?? 0
  // 迟滞：进 8px、退 2px。单一阈值会在触控板微抖时反复切换状态
  scrolled.value = scrolled.value ? top > 2 : top > 8
}

const handleScroll = () => {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    readScroll()
  })
}

// 换页后内容高度变了，main 的 scrollTop 会被浏览器钳制，需要重新判定一次
const route = useRoute()
watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    readScroll()
  },
)

onMounted(() => {
  scroller = document.querySelector('main')
  scroller?.addEventListener('scroll', handleScroll, { passive: true })
  readScroll()
})

onBeforeUnmount(() => {
  scroller?.removeEventListener('scroll', handleScroll)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped lang="scss">
.site-header {
  /* 两态的差异全部收在这组变量里：is-scrolled 只改变量，transition 只写一次 */
  --nav-padding: 0px;
  --nav-max-width: 1260px;
  --nav-height: 64px;
  --nav-radius: 0px;
  --nav-bg: transparent;
  --nav-border: transparent;
  --nav-blur: 0px;
  --nav-shadow: 0 0 #0000;
  --nav-ease: cubic-bezier(0.22, 1, 0.36, 1);

  position: fixed;
  inset: 0 0 auto;
  z-index: 9999;
  display: flex;
  justify-content: center;
  padding: var(--nav-padding);
  // 容器只负责定位，点击穿透给页面；真正的点击区域在 nav 上
  pointer-events: none;
  transition: padding 600ms var(--nav-ease);

  &.is-scrolled {
    --nav-padding: 14px 24px 0;
    --nav-max-width: 960px;
    --nav-height: 56px;
    --nav-radius: 999px;
    --nav-bg: color-mix(in srgb, var(--surface) 72%, transparent);
    --nav-border: var(--border);
    --nav-blur: 14px;
    --nav-shadow: 0 8px 24px -10px rgba(0, 0, 0, 0.35);
  }

  a {
    padding: 10px;
    text-decoration: none;
    transition: color 160ms ease;

    &:hover {
      color: var(--accent);
    }
  }
}

.site-header__nav {
  pointer-events: auto;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: var(--nav-max-width);
  height: var(--nav-height);
  padding: 0 clamp(16px, 3vw, 40px);
  color: var(--muted);
  background: var(--nav-bg);
  border: 1px solid var(--nav-border);
  border-radius: var(--nav-radius);
  box-shadow: var(--nav-shadow);
  backdrop-filter: blur(var(--nav-blur));
  transition: 600ms var(--nav-ease);
}

// 主题切换 + 返回主页：margin-left: auto 把整组推到导航栏最右侧
.site-header__actions {
  margin-left: auto;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.theme-toggle {
  width: 40px;
  height: 36px;
  border-radius: 6px;
  color: var(--muted);
  transition: 160ms all;
}

.theme-toggle:hover,
.back:hover {
  scale: 1.2;
}

// 偏好减少动态效果时直接切状态，不做位移/圆角/模糊的过渡
@media (prefers-reduced-motion: reduce) {
  .site-header,
  .site-header__nav {
    transition: none;
  }
}
</style>
