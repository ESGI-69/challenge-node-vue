<template>
  <div class="the-game">
    <h1>Hello Game !</h1>
   
  </div>
</template>

<script>
import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';

export default {
  name: 'GameView',
  components: {
  },
  setup() {
    const gameStore = useGameStore();

    // create game (empty object because its made in the backend)
    gameStore.create({});

    return {
      
    };
  },
};
</script>

<style lang="scss" scoped>
.the-game {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}
</style>
