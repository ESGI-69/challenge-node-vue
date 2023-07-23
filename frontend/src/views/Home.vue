<template>
  <div class="home">
    <container class="home__menu">
      <div class="home__menu__content">
        <h1 class="home__menu__content__title">
          Main Menu
        </h1>
        <button
          class="nes-btn is-primary"
          @click="createGame"
        >
          Create Game
        </button>
        <router-link
          :to="{ name: 'join' }"
          class="nes-btn"
        >
          Join Game
        </router-link>
        <div class="nes-separator" />
        <router-link
          :to="{ name: 'cards' }"
          class="nes-btn"
        >
          My Cards
        </router-link>
        <router-link
          :to="{ name: 'packs' }"
          class="nes-btn"
        >
          My Packs
        </router-link>
        <router-link
          :to="{ name: 'shop' }"
          class="nes-btn"
        >
          Shop
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
          :to="{ name: 'home' }"
          class="nes-btn"
        >
          Settings
        </router-link>
        <router-link
          :to="{ name: 'edit-profile' }"
          class="nes-btn"
        >
          Edit Profile
        </router-link>
        <router-link
          :to="{ name: 'game-history' }"
          class="nes-btn"
        >
          Games History
        </router-link>
        <router-link
          :to="{ name: 'payments-history' }"
          class="nes-btn"
        >
          Payments History
        </router-link>
        <router-link
          :to="{ name: 'stats' }"
          class="nes-btn"
        >
          Statistics
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
import { useRouter } from 'vue-router';

import Container from '@/components/Container.vue';

import { useAuthStore } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';
import { useGameStore } from '@/stores/gameStore';

export default {
  name: 'HomeView',
  components: {
    Container,
  },
  setup() {
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    const gameStore = useGameStore();
    const router = useRouter();

    const isAdmin = computed(() => profileStore.isAdmin);

    const avatarUrl = computed(() => profileStore.avatarUrl);

    const logout = () => {
      authStore.logout();
      // reload the page to reset the app
      router.go();
    };

    const createGame = async () => {
      try {
        const id = await gameStore.create();
        router.push({ name: 'lobby', params: { id } });
      } catch (error) {
        console.error('Error while creating game');
        console.error(error);
      }
    };

    return {
      logout,
      isAdmin,
      avatarUrl,
      createGame,
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
