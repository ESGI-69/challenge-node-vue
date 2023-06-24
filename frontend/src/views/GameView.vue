<template>
  <div class="the-game nes-container is-rounded  is-centered">

      <div v-if="isGameLoading.value">
          <h2>Game is loading</h2>
      </div>
      <div v-else>
          <h2>{{ status }}</h2>
          <p>  Game token : {{ actualGame.value.token }} </p>
          <button type="button" class="nes-btn is-error">Quitter la partie</button>
        </div>
 
 </div> 
</template>



<script>
import { reactive, computed, ref } from 'vue';
import { useGameStore } from '@/stores/gameStore';
// import Game from '@/components/Game.vue';

export default {
  name: 'GameView',
  components: {
    // Game,
  },
  setup() {
    const gameStore = useGameStore();
    const isGameLoading = reactive({
      value: false,
    });
    const createGame = reactive({
      value: null,
    });
    const actualGame = reactive({
      value: null,
    });

    createGame.value = computed(() => gameStore.create({}));
    actualGame.value = computed(() => gameStore.games);
    isGameLoading.value = computed(() => gameStore.isGameLoading);

    const status = computed(() => {
      if (isGameLoading.value) return 'Loading...';
      if (createGame.value) return 'Game created';
      if (actualGame.value) return 'Game loaded';
      return 'Crushing the Bridge of Khazad-dûm ...';
    });


    return {
      createGame,
      isGameLoading,
      actualGame,
      status,
    };
  },
};
</script>

<style lang="scss" scoped>
.the-game {
 
  background-color: #fff;
}
</style>
