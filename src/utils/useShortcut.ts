// hooks/useShortcutManager.ts
import { reactive, readonly, onUnmounted } from 'vue'

// 1. 模块作用域内的“私有”状态，天然单例
const state = reactive({
  activeKeys: new Set<string>(),
  lastTriggered: '',
})

// 存放回调函数的 Map (不需要响应式，避免性能损耗)
const actionsMap = new Map<string, Function>()

// 2. 导出组合式函数
export function useShortcutManager() {
  // 注册快捷键
  const register = (key: string, action: Function) => {
    actionsMap.set(key, action)
    state.activeKeys.add(key)

    // 自动清理机制：如果是在组件内注册，组件销毁时自动卸载，防止内存泄漏
    onUnmounted(() => {
      unregister(key)
    })
  }

  const unregister = (key: string) => {
    actionsMap.delete(key)
    state.activeKeys.delete(key)
  }

  const trigger = (key: string) => {
    const action = actionsMap.get(key)
    if (action) {
      state.lastTriggered = key
      action()
    }
  }

  // 3. 暴露给外部使用的方法和只读状态
  return {
    state: readonly(state), // 防止外部直接修改状态
    register,
    unregister,
    trigger,
  }
}
