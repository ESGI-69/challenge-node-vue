<template>
  <div class="topbar">
    <div class="topbar__left">
      <transition
        name="slide-left"
        mode="out-in"
      >
        <button
          v-if="isInDeck"
          class="nes-btn topbar__left__menu-button is-primary"
          @click="goToDecks"
        >
          &lt; Back to decks list
        </button>
        <button
          v-else-if="!isHome && !isInGame && !isInLobby"
          class="nes-btn topbar__left__menu-button is-primary"
          @click="goToHome"
        >
          &lt; Back to main menu
        </button>
        <button
          v-else-if="isInGame && game"
          class="nes-btn topbar__left__menu-button is-error"
          @click="isForfeitModalOpen = true"
        >
          X Declare forfeit
        </button>
        <button
          v-else-if="isInLobby && iAmGameOwner"
          class="nes-btn topbar__left__menu-button is-error"
          @click="isCancelGameModalOpen = true"
        >
          X Cancel game
        </button>
        <button
          v-else-if="isInLobby && !iAmGameOwner"
          class="nes-btn topbar__left__menu-button is-error"
          @click="leaveLobby"
        >
          X Leave lobby
        </button>
      </transition>
    </div>
    <div class="topbar__center">
      <transition
        name="slide-down"
        mode="out-in"
      >
        <template
          v-if="isInGame && gameStartTime"
        >
          <game-info
            :id="gameId"
            :turn-quantity="gameTurnQuantity"
            :start-time="gameStartTime"
          />
        </template>
      </transition>
    </div>
    <user-info class="topbar__user-info" />
    <modal
      v-model:isOpen="isForfeitModalOpen"
      @confirm="declareForfeit"
    >
      <template #header>
        <h2>Declare forfeit ?</h2>
      </template>
      <p>Your about to declare forfeit.</p>
      <p>Are you sure you want to declare forfeit?</p>
      <p>The opponent will be declared as a winner</p>
      <template #confirm>
        <span>I declare forfeit</span>
      </template>
    </modal>
    <modal
      v-model:isOpen="isCancelGameModalOpen"
      @confirm="cancelGame"
    >
      <template #header>
        <h2>Cancel the game ?</h2>
      </template>
      <p>Your about to cancel the game.</p>
      <p>Are you sure you want to cancel the game?</p>
      <p>The lobby will be cose. If you want to reinvite your friends, you will need to create a new game.</p>
      <template #confirm>
        <span>Cancel the game</span>
      </template>
    </modal>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import GameInfo from '@/components/Topbar/GameInfo.vue';
import Modal from './Modal.vue';
import UserInfo from './UserInfo.vue';

import { useGameStore } from '@/stores/gameStore';

import logo from '@/assets/logo.png';

export default {
  name: 'Topbar',
  components: {
    UserInfo,
    Modal,
    GameInfo,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const gameStore = useGameStore();

    const game = computed(() => gameStore.game);
    const iAmGameOwner = computed(() => gameStore.iAmGameOwner);
    const gameId = computed(() => gameStore.game.id);
    const gameStartTime = computed(() => gameStore.game.startedAt);
    const gameTurnQuantity = computed(() => gameStore.game.turn_count);

    const goToHome = () => {
      router.push({ name: 'home' });
    };

    const isHome = computed(() => route.name === 'home' || route.name?.startsWith('home-'));
    const isInGame = computed(() => route.name === 'game');
    const isInLobby = computed(() => route.name === 'lobby');
    const isInDeck = computed(() => route.name === 'deck');

    const isForfeitModalOpen = ref(false);

    const declareForfeit = async () => {
      await gameStore.leave();
      goToHome();
    };

    const isCancelGameModalOpen = ref(false);

    const cancelGame = async () => {
      await gameStore.remove();
      // Home routing is handled by the socket event in lobby view
    };

    const leaveLobby = async () => {
      await gameStore.leave();
      goToHome();
    };

    const goToDecks = () => {
      router.push({ name: 'decks' });
    };

    return {
      cancelGame,
      declareForfeit,
      game,
      goToHome,
      iAmGameOwner,
      isCancelGameModalOpen,
      isForfeitModalOpen,
      isHome,
      isInGame,
      isInLobby,
      leaveLobby,
      logo,
      gameId,
      gameStartTime,
      gameTurnQuantity,
      isInDeck,
      goToDecks,
    };
  },
};
</script>

<style lang="scss" scoped>
.topbar {
  display: grid;
  grid-template-areas: "left center user-info";
  grid-template-columns: auto 1fr 300px;

  &__left {
    grid-area: left;
    align-self: end;
    padding-left: 1.5rem;

    &__menu-button {
      font-size: 0.75rem;
    }
  }

  &__center {
    grid-area: center;
    justify-self: center;
    align-self: end;
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: center;
  }

  &__user-info {
    grid-area: user-info;
  }
}
</style>
