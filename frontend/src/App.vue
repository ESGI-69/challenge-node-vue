<template>
  <div class="app">
    <header>
      <nav>
        <router-link to="/">
          Home
        </router-link>
        <router-link to="/about">
          About
        </router-link>
      </nav>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router';

export default {
  name: 'App',
  components: {
    RouterLink,
    RouterView,
  },
};
</script>

<style scoped>
.app {
  display: grid;
  grid-template-rows: 50px 1fr;
  height: 100%;
}
</style>
