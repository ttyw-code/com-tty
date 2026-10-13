// 主题工具：在运行时设置 data-theme 并保存到 localStorage
type Theme = 'light' | 'dark'

const THEME_KEY = 'theme'

type ThemeListener = (theme: Theme) => void
const listeners: Set<ThemeListener> = new Set()

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

// 全站默认使用「全局搜索」色系（暗色档）
const DEFAULT_THEME: Theme = 'dark'

export function applySavedTheme(): void {
  if (!isBrowser()) return
  const saved = (localStorage.getItem(THEME_KEY) as Theme) || DEFAULT_THEME
  document.documentElement.setAttribute('data-theme', saved)
}

export function setTheme(theme: Theme): void {
  if (!isBrowser()) return
  document.documentElement.setAttribute('data-theme', theme)
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // ignore storage errors
  }
  // notify listeners
  listeners.forEach((fn) => {
    try {
      fn(theme)
    } catch {
      // swallow
    }
  })
}

export function toggleTheme(): Theme {
  if (!isBrowser()) return DEFAULT_THEME
  const next: Theme = getTheme() === 'dark' ? 'light' : 'dark'
  setTheme(next)
  return next
}

export function getTheme(): Theme {
  if (!isBrowser()) return DEFAULT_THEME
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'light' || attr === 'dark') return attr
  return (localStorage.getItem(THEME_KEY) as Theme) || DEFAULT_THEME
}

export default {
  applySavedTheme,
  setTheme,
  toggleTheme,
  getTheme,
  onThemeChange(fn: ThemeListener) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}
