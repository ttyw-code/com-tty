<template>
  <section class="gemini3">
    <header>
      <h2>Gemini</h2>
    </header>

    <div class="messages">
      <div v-for="(message, index) in messages" :key="index">
        <article>
          <h3>Prompt</h3>
          <p>{{ message.prompt }}</p>
          <h3>Response</h3>
          <div class="markdown" v-html="renderMarkdown(message.response)" />
        </article>
      </div>
      <div v-if="!messages.length" class="empty">No prompts yet.</div>
    </div>
    <form class="prompt-form" @submit.prevent="sendPrompt">
      <textarea
        v-model="prompt"
        placeholder="Describe what you want to ask Gemini..."
        rows="4"
        @keydown.ctrl.enter.prevent="sendPrompt"
      />
      <div class="actions">
        <button type="submit" :disabled="isSendDisabled">
          <span v-if="isBusy" class="spinner" aria-label="loading"></span>
          <span v-else>Send</span>
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { GoogleGenAI } from '@google/genai'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const apiKey = import.meta.env.VITE_GEMINI3_KEY as string | undefined
if (!apiKey) {
  console.warn('VITE_GEMINI3_KEY is not configured. Gemini calls will fail.')
}

const ai = new GoogleGenAI({
  apiKey: apiKey ?? '',
})

const md = new MarkdownIt({
  linkify: true,
  breaks: true,
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
})

type Message = {
  prompt: string
  response: string
}

const prompt = ref('')
const messages = ref<Message[]>([])
const isBusy = ref(false)

const isSendDisabled = computed(() => !prompt.value.trim() || isBusy.value)

function renderMarkdown(text: string) {
  return md.render(text)
}

function streamText(message: Message, fullText: string) {
  return new Promise<void>((resolve) => {
    let i = 0
    const len = fullText.length
    const interval = window.setInterval(() => {
      i += Math.max(1, Math.floor(Math.random() * 3))
      message.response = fullText.slice(0, Math.min(i, len))
      if (i >= len) {
        window.clearInterval(interval)
        resolve()
      }
    }, 20)
  })
}

async function sendPrompt() {
  if (isSendDisabled.value) return

  if (!apiKey) {
    messages.value.unshift({
      prompt: prompt.value.trim(),
      response: 'VITE_GEMINI3_KEY 未配置，无法调用 Gemini。',
    })
    return
  }

  const snapshot = prompt.value.trim()
  isBusy.value = true
  prompt.value = ''

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: snapshot,
    })
    const text = result.text ?? JSON.stringify(result, null, 2)
    const message = reactive({ prompt: snapshot, response: '' } as Message)
    messages.value.unshift(message)
    await streamText(message, text)
  } catch (error) {
    const messageText = error instanceof Error ? error.message : String(error)
    const message = reactive({ prompt: snapshot, response: '' } as Message)
    messages.value.unshift(message)
    await streamText(message, `调用失败：${messageText}`)
  } finally {
    isBusy.value = false
  }
}
</script>

<style scoped>
.gemini3 {
  display: grid;
  gap: 1.5rem;
  padding: 2rem 2rem 0 2rem;
  justify-items: center;
  width: 100%;
  background: var(--bg);
  color: var(--text);
}

.gemini3 > * {
  width: 100%;
}

header h2 {
  margin: 0;
  padding-left: 25px;
  font-size: larger;
  font-family:
    Google Sans Flex,
    Google Sans,
    Helvetica Neue,
    sans-serif;
}

.prompt-form {
  display: grid;
  width: min(60rem, 100%);
  margin: 0 auto;
}

textarea {
  width: 100%;
  max-width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--surface);
  color: var(--text);
  font-family: inherit;
  resize: vertical;
  display: block;
}

textarea::placeholder {
  color: var(--faint);
}

textarea:focus {
  outline: none;
  border-color: var(--border-strong);
}

.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
}

button {
  padding: 0.5rem 1.25rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--primary);
  color: var(--on-primary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

button:hover:not(:disabled) {
  background: var(--surface-3);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--on-primary);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  box-sizing: border-box;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.status {
  font-size: 0.9rem;
  color: var(--muted);
}

.messages {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  width: 60rem;
  display: grid;
  gap: 1rem;
  color: var(--text-2);
}

article {
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1rem;
  background: var(--surface);
  color: var(--text);
  word-break: break-word;
  overflow-wrap: anywhere;
}

article h3 {
  margin: 0 0 0.25rem;
}

article .markdown {
  margin: 0;
  color: inherit;
}

article .markdown :deep(pre) {
  white-space: pre-wrap;
  word-break: break-word;
  background: var(--bg);
  color: var(--text-2);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  overflow-x: auto;
}

article .markdown :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    'Liberation Mono', 'Courier New', monospace;
  font-size: 0.9rem;
}

article .markdown :deep(p code) {
  background: var(--surface-3);
  color: var(--text);
  padding: 0.1rem 0.35rem;
  border-radius: 0.35rem;
  border: 1px solid var(--border);
}

.empty {
  text-align: center;
  color: var(--faint);
}
</style>
