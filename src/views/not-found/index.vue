<template>
  <section class="not-found">
    <h1 class="not-found__code">404</h1>
    <p class="not-found__text">这个页面不存在</p>
    <RouterLink class="not-found__back" :to="{ name: 'home' }">
      回到首页
    </RouterLink>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.not-found {
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--text);
}

.not-found__code {
  font-size: 4rem;
  font-weight: bold;
  margin: 0;
  letter-spacing: 0.1em;
}

.not-found__text {
  margin: 0;
  color: var(--muted);
}

.not-found__back {
  padding: 0.5rem 1.25rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--primary);
  color: var(--on-primary);
  text-decoration: none;

  &:hover {
    background: var(--surface-3);
  }
}
</style>
