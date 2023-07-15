<template>
  <container
    class="game"
    :is-rounded="true"
  >
    <div v-if="isGameLoading">
      <h2>Crushing the Bridge of Khazad-dûm ...</h2>
    </div>
    <div v-else-if="!isGameFound">
      <h2>Game not found</h2>
    </div>
    <div v-else>
      <p v-if="actualGame.id">
        Game ID : {{ actualGame.id }}
      </p>
      <ul>
        <li v-if="iAmGameOwner">
          {{ profile.firstname }} (you)
        </li>
        <li v-else>
          {{ actualGame.firstPlayer.firstname }}
        </li>
        <li v-if="actualGame.second_player === profile.id">
          {{ profile.firstname }} (you)
        </li>
        <li v-else-if="actualGame.secondPlayer">
          {{ actualGame.secondPlayer.firstname }}
        </li>
        <li v-else>
          Waiting for a second player ...
        </li>
      </ul>
      <div class="game__buttons">
        <button
          v-if="iAmGameOwner"
          type="button"
          class="nes-btn"
          :class="{
            'is-disabled': !actualGame.second_player,
            'is-primary': actualGame.second_player,
          }"
          @click="startGame"
        >
          Start game
        </button>
        <button
          v-if="iAmGameOwner"
          type="button"
          class="nes-btn is-error"
          @click="removeGame"
        >
          Cancel game
        </button>
        <button
          v-else
          type="button"
          class="nes-btn is-error"
          @click="leaveGame"
        >
          Leave Game
        </button>
      </div>
    </div>
  </container>
</template>



<script>
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import Container from '@/components/Container.vue';

import { useGameStore } from '@/stores/gameStore';
import { useProfileStore } from '@/stores/profileStore';
import { socket } from '@/socket';

export default {
  name: 'GameView',
  components: {
    Container,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const gameStore = useGameStore();
    const profileStore = useProfileStore();

    const actualGame = computed(() => gameStore.game);
    const isGameLoading = computed(() => gameStore.isGameLoading);
    const isGameLeft = computed(() => gameStore.isGameLeft);
    const iAmGameOwner = computed(() => gameStore.iAmGameOwner);

    const profile = computed(() => profileStore.profile);

    const isGameFound = ref(true);

    socket.on('game:joined', (game) => {
      gameStore.setGame(game);
    });

    socket.on('game:leaved', (game) => {
      gameStore.setGame(game);
    });

    socket.once('game:started', (game) => {
      gameStore.setGame(game);
      router.push({ name: 'game', params: { id: game.id } });
    });

    socket.on('game:removed', () => {
      gameStore.$reset();
      router.push({ name: 'home' });
    });

    const leaveGame = async () => {
      try {
        await gameStore.leave();
        router.push({ name: 'home' });
      } catch (error) {
        console.error('Error while leaving game');
        console.error(error);
      }
    };

    const removeGame = async () => {
      try {
        await gameStore.remove();
      } catch (error) {
        console.error('Error while removing game');
        console.error(error);
      }
    };

    const startGame = async () => {
      try {
        await gameStore.start();
      } catch (error) {
        console.error('Error while starting game');
        console.error(error);
      }
    };

    const getGame = async () => {
      isGameFound.value = false;
      try {
        await gameStore.getGame(route.params.id);
        isGameFound.value = true;
      } catch (error) {
        isGameFound.value = false;
      }
    };

    if (route.params.id) {
      getGame();
    } else {
      router.push({ path: '/' });
    }

    return {
      actualGame,
      iAmGameOwner,
      isGameFound,
      isGameLeft,
      isGameLoading,
      leaveGame,
      profile,
      removeGame,
      startGame,
    };
  },
};
</script>

<style lang="scss" scoped>
.game {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &__buttons {
    display: flex;
    gap: 1rem;
  }
}
</style>
