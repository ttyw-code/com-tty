<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="global-search-mask" @click="close">
        <div class="global-search-container" @click.stop>
          <div class="search-input-wrapper">
            <i class="search-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </i>
            <input
              ref="inputRef"
              v-model="searchQuery"
              type="text"
              placeholder="搜索..."
              @keydown.esc="close"
            />
          </div>
          <div class="search-body">
            <!-- 这里可以放置搜索结果 -->
            <div class="empty-state" v-if="!searchQuery">
              输入关键词进行搜索...
            </div>
          </div>
          <div class="search-footer">
            <span>
              <kbd>Esc</kbd>
              关闭
            </span>
            <span>
              <kbd>↵</kbd>
              选择
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const visible = ref(false)
const searchQuery = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const open = () => {
  visible.value = true
  searchQuery.value = ''
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const close = () => {
  visible.value = false
}

const handleKeydown = (e: KeyboardEvent) => {
  // Ctrl + K or Command + K to open
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    if (visible.value) {
      close()
    } else {
      open()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// 暴露 open 方法给父组件或其他组件使用（如果需要）
defineExpose({
  open,
  close,
})
</script>

<style scoped lang="scss">
.global-search-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 14vh;
}

.global-search-container {
  width: 600px;
  max-width: 90%;
  background: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: #fff;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #333;

  .search-icon {
    margin-right: 12px;
    display: flex;
    color: #999;
  }

  input {
    flex: 1;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 18px;
    outline: none;

    &::placeholder {
      color: #666;
    }
  }
}

.search-body {
  min-height: 100px;
  padding: 20px;

  .empty-state {
    color: #666;
    text-align: center;
    font-size: 14px;
  }
}

.search-footer {
  padding: 10px 20px;
  background: #252525;
  color: #666;
  font-size: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  border-top: 1px solid #333;

  kbd {
    background: #333;
    padding: 2px 6px;
    border-radius: 4px;
    margin-right: 4px;
    font-family: monospace;
    border-bottom: 1px solid #000;
    color: #aaa;
  }
}

/* Transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
