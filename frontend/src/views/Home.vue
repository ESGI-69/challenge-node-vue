<template>
  <div
    class="home"
    :class="{ 'home--is-submenu-displayed': isSubmenuDisplayed }"
  >
    <container class="home__menu">
      <h1 class="home__menu__title">
        Main Menu
      </h1>
      <button
        v-if="isGameRunning === null"
        class="nes-btn is-primary home__menu__create"
        @click="createGame"
      >
        Create Game
      </button>
      <router-link
        v-else-if="isGameRunning !== null && isGameRunning.startedAt === null"
        :to="{ name: 'lobby', params: { id: isGameRunning.id } }"
        class="home__menu__create"
      >
        <button class="nes-btn is-primary">
          Resume Game
        </button>
      </router-link>
      <router-link
        v-else
        :to="{ name: 'game', params: { id: isGameRunning.id } }"
        class="home__menu__create"
      >
        <button class="nes-btn is-primary">
          Resume Game
        </button>
      </router-link>
      <router-link
        v-if="isGameRunning === null"
        :to="{ name: 'join' }"
        class="home__menu__join"
      >
        <button class="nes-btn">
          Join Game
        </button>
      </router-link>
      <router-link
        v-else
        :to="{ name: 'join' }"
        class="home__menu__join"
      >
        <button
          class="nes-btn is-disabled"
          disabled
        >
          Join Game
        </button>
      </router-link>
      <router-link
        :to="{ name: 'home-packs-cards' }"
        class="home__menu__card-packs"
      >
        <button class="nes-btn">
          Packs & Cards
        </button>
      </router-link>
      <router-link
        v-if="isAdmin"
        to="/admin"
        class="home__menu__admin"
      >
        <button class="nes-btn is-success">
          Admin Panel
        </button>
      </router-link>
      <router-link
        :to="{ name: 'edit-profile' }"
        class="home__menu__profile"
      >
        <button class="nes-btn">
          Edit Profile
        </button>
      </router-link>
      <router-link
        :to="{ name: 'home-history-stats' }"
        class="home__menu__history-stats"
      >
        <button class="nes-btn">
          History & Stats
        </button>
      </router-link>
      <button
        class="nes-btn is-error home__menu__logout"
        @click="logout"
      >
        Logout
      </button>
    </container>
    <container
      v-if="isSubmenuDisplayed"
      class="home__sub-menu"
    >
      <div class="home__sub-menu__header">
        <button
          class="home__sub-menu__header__close nes-btn is-error"
          @click="$router.push({ name: 'home' })"
        >
          X Close
        </button>
        {{ routeDisplayName }}
      </div>
      <router-view />
    </container>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import Container from '@/components/Container.vue';

import { useAuthStore } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';
import { useGameStore } from '@/stores/gameStore';
import { usePackStore } from '@/stores/packStore';

export default {
  name: 'HomeView',
  components: {
    Container,
  },
  setup() {
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    const gameStore = useGameStore();
    const packStore = usePackStore();
    const router = useRouter();
    const route = useRoute();

    const isAdmin = computed(() => profileStore.isAdmin);

    const avatarUrl = computed(() => profileStore.avatarUrl);

    const isGameRunning = computed(() => gameStore.isGameRunning);

    const isSubmenuDisplayed = computed(() => route.name !== 'home');
    const routeDisplayName = computed(() => route.meta.displayName);

    const getGameRunning = () => {
      gameStore.getGameRunning();
    };

    getGameRunning();
    packStore.resetOpenning();

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
      isGameRunning,
      avatarUrl,
      createGame,
      getGameRunning,
      isSubmenuDisplayed,
      routeDisplayName,
    };
  },
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;

  &__menu {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "title title"
      "admin admin"
      "create profile"
      "create history-stats"
      "join card-packs"
      "join logout";

    & > a {
      display: flex;
      width: 100%;

      &:hover {
        text-decoration: none;
      }

      & > button {
        width: 100%;
      }
    }

    &__title {
      grid-area: title;
      text-align: center;
    }

    &__create {
      grid-area: create;
    }

    &__profile {
      grid-area: profile;
    }

    &__history-stats {
      grid-area: history-stats;
    }

    &__join {
      grid-area: join;
    }

    &__logout {
      grid-area: logout;
    }

    &__card-packs {
      grid-area: card-packs;
    }

    &__admin {
      grid-area: admin;
    }
  }

  &__sub-menu {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &__header {
      display: flex;
      gap: 1rem;
      align-items: center;
      white-space: nowrap;
      padding-bottom: 1rem;
      border-bottom: 0.25rem solid black;

      &__close {
        font-size: 0.75rem;
      }
    }
  }
}
</style>
