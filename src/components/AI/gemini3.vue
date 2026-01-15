<template>
  <section class="gemini3">
    <header>
      <h2>Gemini 3 Console</h2>
      <p>Enter a prompt and review the responses below.</p>
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
          <pre>{{ message.response }}</pre>
        </article>
      </li>
      <li v-if="!messages.length" class="empty">No prompts yet.</li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { GoogleGenAI } from '@google/genai'

const apiKey = import.meta.env.VITE_GEMINI3_KEY as string | undefined
if (!apiKey) {
  console.warn('VITE_GEMINI3_KEY is not configured. Gemini calls will fail.')
}

const ai = new GoogleGenAI({
  apiKey: apiKey ?? '',
})

type Message = {
  prompt: string
  response: string
}

const prompt = ref('')
const messages = ref<Message[]>([])
const isBusy = ref(false)

const isSendDisabled = computed(() => !prompt.value.trim() || isBusy.value)

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
      model: 'gemini-3-flash-preview',
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

article pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.empty {
  text-align: center;
  color: #9aa0a6;
}
</style>
