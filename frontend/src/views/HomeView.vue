<template>
  <div class="home">
    <img
      class="home__logo"
      :src="logo"
      alt="logo"
    >
    <container class="home__menu">
      <div class="home__menu__content">
        <h1 class="home__menu__content__title">
          Main Menu
        </h1>
        <router-link
          to="/game"
          class="nes-btn is-primary"
        >
          Start Game
        </router-link>
        <router-link
          to="/cards"
          class="nes-btn"
        >
          My Cards
        </router-link>
        <div class="nes-separator" />
        <router-link
          to="/admin"
          class="nes-btn"
        >
          Admin Panel
        </router-link>
        <router-link
          to="/settings"
          class="nes-btn"
        >
          Settings
        </router-link>
        <button
          class="nes-btn is-error"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </container>
  </div>
</template>

<script>
import logo from '@/assets/logo.png';
import Container from '@/components/Container.vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

export default {
  name: 'HomeView',
  components: {
    Container,
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const logout = () => {
      authStore.logout();
      // reload the page to reset the app
      router.go();
    };
    return {
      logo,
      logout,
    };
  },
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;

  &__logo {
    width: 12rem;
    height: 12rem;
  }

  &__menu {
    // gap + logo height
    margin-bottom: calc(1rem + 12rem);

    &__content {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .nes-separator {
        margin: 0 3rem;
      }
    }
  }
}
</style>
