<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/getting-started">Getting Started</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}

header {
  background: linear-gradient(90deg, #ff6b35, #f7931e);
  padding: 0.75rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  flex-shrink: 0;
}

nav {
  display: flex;
  justify-content: center;
  gap: 2rem;
  align-items: center;
  height: 100%;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

nav a.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: bold;
}

nav a.router-link-exact-active:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

.main-content {
  flex: 1;
  width: 100%;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}
</style>
