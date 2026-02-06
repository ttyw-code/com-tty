<template>
  <section class="gemini3">
    <header>
      <h2>Gemini 3 pro</h2>
    </header>

    <form class="prompt-form" @submit.prevent="sendPrompt">
      <textarea
        v-model="prompt"
        placeholder="Describe what you want to ask Gemini..."
        rows="4"
        @keydown.ctrl.enter.prevent="sendPrompt"
      />
      <div class="actions">
        <button type="submit" :disabled="isSendDisabled">Send</button>
        <span v-if="isBusy" class="status">Sending...</span>
      </div>
    </form>

    <ul class="messages">
      <li v-for="(message, index) in messages" :key="index">
        <article>
          <h3>Prompt</h3>
          <p>{{ message.prompt }}</p>
          <h3>Response</h3>
          <div class="markdown" v-html="renderMarkdown(message.response)" />
        </article>
      </li>
      <li v-if="!messages.length" class="empty">No prompts yet.</li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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
    messages.value.unshift({ prompt: snapshot, response: text })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    messages.value.unshift({
      prompt: snapshot,
      response: `调用失败：${message}`,
    })
  } finally {
    isBusy.value = false
  }
}
</script>

<style scoped>
.gemini3 {
  display: grid;
  gap: 1.5rem;
  padding: 2rem;
  justify-items: center;
  width: 100%;
}

.gemini3 > * {
  width: min(900px, 100%);
}

header h2 {
  margin: 0;
}

.prompt-form {
  display: grid;
  gap: 0.75rem;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #c8ccd0;
  border-radius: 0.5rem;
  font-family: inherit;
  resize: vertical;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

button {
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  background: #2f54eb;
  color: #fff;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status {
  font-size: 0.9rem;
  color: blue;
}

.messages {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 1rem;
  color: skyblue;
}

article {
  border: 1px solid #e5e5e5;
  border-radius: 0.75rem;
  padding: 1rem;
  background: #fafafa;
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
  background: #0f172a;
  color: #e2e8f0;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(15, 23, 42, 0.2);
  overflow-x: auto;
}

article .markdown :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    'Liberation Mono', 'Courier New', monospace;
  font-size: 0.9rem;
}

article .markdown :deep(p code) {
  background: rgba(15, 23, 42, 0.08);
  color: #0f172a;
  padding: 0.1rem 0.35rem;
  border-radius: 0.35rem;
  border: 1px solid rgba(15, 23, 42, 0.12);
}

.empty {
  text-align: center;
  color: #9aa0a6;
}
</style>
