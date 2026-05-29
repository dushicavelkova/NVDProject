<template>
  <nav class="navbar">
    <span class="logo">THE BLADE</span>
    <ul>
      <li><a href="#services">Services</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#booking" class="cta">Book Now</a></li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 3rem;
  background: rgba(13,13,13,0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.logo {
  font-family: var(--font-head);
  font-size: 1.4rem;
  letter-spacing: 0.15em;
  color: var(--gold);
}
ul {
  display: flex;
  gap: 2rem;
  list-style: none;
}
a {
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s;
  font-size: 0.9rem;
}
a:hover { color: var(--text); }
.cta {
  padding: 0.5rem 1.4rem;
  border: 1px solid var(--gold);
  color: var(--gold) !important;
  border-radius: 2px;
  transition: all 0.2s;
}
.cta:hover {
  background: var(--gold);
  color: var(--bg) !important;
}
</style>