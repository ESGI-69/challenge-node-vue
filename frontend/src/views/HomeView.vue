<template>
  <div class="home">
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
        <router-link
          to="/packs"
          class="nes-btn"
        >
          My Packs
        </router-link>
        <div class="nes-separator" />
        <router-link
          v-if="isAdmin"
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
        <router-link
          to="/profile"
          class="nes-btn"
        >
          Edit Profile
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
import { computed } from 'vue';

import Container from '@/components/Container.vue';

import { useRouter } from 'vue-router';

import { useAuthStore } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';

export default {
  name: 'HomeView',
  components: {
    Container,
  },
  setup() {
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    const router = useRouter();

    const isAdmin = computed(() => profileStore.isAdmin);

    const avatarUrl = computed(() => profileStore.avatarUrl);

    const logout = () => {
      authStore.logout();
      // reload the page to reset the app
      router.go();
    };
    return {
      logout,
      isAdmin,
      avatarUrl,
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
