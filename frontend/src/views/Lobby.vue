<template>
  <div class="the-game nes-container is-rounded  is-centered">
    <div v-if="isGameLoading">
      <h2>Crushing the Bridge of Khazad-dûm ...</h2>
    </div>
    <div v-else>
      <p v-if="actualGame.id">
        Game ID : {{ actualGame.id }}
      </p>
      <button
        type="button"
        class="nes-btn is-error"
        @click="leaveGame"
      >
        Quitter la partie
      </button>
    </div>
  </div>
</template>



<script>
import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import router from '@/router';
// import Game from '@/components/Game.vue';

export default {
  name: 'GameView',
  components: {
    // Game,
  },
  setup() {
    const gameStore = useGameStore();

    gameStore.create();
    const actualGame = computed(() => gameStore.games);
    const isGameLoading = computed(() => gameStore.isGameLoading);
    const isGameLeft = computed(() => gameStore.isGameLeft);

    const leaveGame = async () => {
      try {
        await gameStore.leave();
        router.push({ path: '/' });
      } catch (error) {
        console.error('Error while leaving game');
        console.error(error);
      }
    };

    return {
      isGameLoading,
      actualGame,
      leaveGame,
      isGameLeft,
    };
  },
};
</script>

<style lang="scss" scoped>
.the-game {
  background-color: #fff;
}
</style>
