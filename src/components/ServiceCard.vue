<template>
  <div class="card">
    <span class="icon">{{ icon }}</span>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <span class="price">{{ price }}</span>
  </div>
</template>

<script setup>
defineProps(['icon', 'title', 'description', 'price'])
</script>

<style scoped>
.card {
  padding: 2rem;
  border: 1px solid var(--border);
  background: var(--surface);
  transition: border-color 0.3s, transform 0.3s;
  cursor: default;
  border-radius: 4px;
}
.card:hover {
  border-color: var(--gold);
  transform: translateY(-4px);
}
.icon { font-size: 2rem; }
h3 {
  font-family: var(--font-head);
  margin: 0.8rem 0 0.4rem;
  font-size: 1.2rem;
}
p {
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}
.price {
  color: var(--gold);
  font-weight: 500;
  font-size: 1.1rem;
}
</style>