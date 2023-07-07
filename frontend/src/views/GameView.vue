<template>
  <div class="the-game nes-container is-rounded  is-centered">
    <div v-if="isGameLoading.value">
      <h2>Game is loading</h2>
    </div>
    <div v-else>
      <h2>{{ status }}</h2>
      <p v-if="actualGame.value.token">
        Game token : {{ actualGame.value.token }}
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
import { reactive, computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import router from '@/router';
import { socket } from '@/socket';
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
    const isGameLeft = reactive({
      value: false,
    });

    // watchEffect(() => {
    //   if(actualGame.value != null){
    //     if(actualGame.value.token != null){
    //       //
    //     }
    //   }
    // });

    createGame.value = computed(() => gameStore.create({ socketId : socket.id }));
    actualGame.value = computed(() => gameStore.games);
    isGameLoading.value = computed(() => gameStore.isGameLoading);
    isGameLeft.value = computed(() => gameStore.isGameLeft);

    const status = computed(() => {
      if (isGameLoading.value) return 'Loading...';
      if (createGame.value) return 'Game created';
      if (actualGame.value) return 'Game loaded';
      return 'Crushing the Bridge of Khazad-dûm ...';
    });

    function leaveGame() {
      gameStore.leave({ id: actualGame.value.id, socketId : socket.id }).then(() => {
        if (isGameLeft.value){
          router.push({ path: '/' });
        } else {
          // do nothing
        }
      });
    }

    return {
      createGame,
      isGameLoading,
      actualGame,
      status,
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
