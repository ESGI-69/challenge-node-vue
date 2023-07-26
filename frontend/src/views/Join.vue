<template>
  <container class="join">
    <h1>Join a game</h1>
    <p>Enter the game code to join a game</p>
    <div class="input">
      <input
        v-model="gameId"
        type="text"
        class="nes-input"
        maxlength="6"
        @keyup.enter="joinGame"
      >
      <button
        class="nes-btn"
        :class="{
          'is-primary': gameId.length === 6,
          'is-disabled': gameId.length !== 6,
        }"
        :disabled="gameId.length !== 6"
        @click="joinGame"
      >
        Join game
      </button>
    </div>
    <p
      v-if="errorMessage !== ''"
      class="nes-text is-error"
    >
      {{ errorMessage }}
    </p>
    <p class="nes-text is-error">
      {{ gameNotFound ? 'Game code incorrect, please try again' : ' ' }}
    </p>
  </container>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import Container from '@/components/Container.vue';

import { useGameStore } from '@/stores/gameStore';

export default {
  name: 'JoinView',
  components: {
    Container,
  },
  setup() {
    const router = useRouter();
    const gameStore = useGameStore();

    const gameId = ref('');
    const gameNotFound = ref(false);
    const errorMessage = ref('');

    const joinGame = async () => {
      errorMessage.value = '';
      gameNotFound.value = false;
      try {
        const { id } = await gameStore.join(gameId.value);
        router.push({ name: 'lobby', params: { id } });
      } catch (error) {
        errorMessage.value = error.data.reason;
        if (error.status === 404) {
          gameNotFound.value = true;
        } else {
          throw error;
        }
        gameId.value = '';
      }
    };

    return { gameId, joinGame, gameNotFound, errorMessage };
  },
};
</script>

<style lang="scss" scoped>
.join {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;

  h1 {
    font-weight: 400;
    margin: 0;
  }

  p {
    margin: 0;
    height: 24px;
  }

  .input {
    display: flex;
    align-items: center;
    gap: 1rem;

    input {
      width: 10rem;
      text-transform: uppercase;
    }

    button {
      white-space: nowrap;
    }
  }
}
</style>
