// 主题工具：在运行时设置 data-theme 并保存到 localStorage
type Theme = 'light' | 'dark'

const THEME_KEY = 'theme'

type ThemeListener = (theme: Theme) => void
const listeners: Set<ThemeListener> = new Set()

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export function applySavedTheme(): void {
  if (!isBrowser()) return
  const saved = (localStorage.getItem(THEME_KEY) as Theme) || 'light'
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

export function setTheme(theme: Theme): void {
  if (!isBrowser()) return
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch (e) {
    // ignore storage errors
  }
  // notify listeners
  listeners.forEach((fn) => {
    try {
      fn(theme)
    } catch (e) {
      // swallow
    }
  })
}

export function toggleTheme(): Theme {
  if (!isBrowser()) return 'light'
  const current =
    document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'dark'
      : 'light'
  const next: Theme = current === 'dark' ? 'light' : 'dark'
  setTheme(next)
  return next
}

export function getTheme(): Theme {
  if (!isBrowser()) return 'light'
  return (
    (localStorage.getItem(THEME_KEY) as Theme) ||
    (document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'dark'
      : 'light')
  )
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
