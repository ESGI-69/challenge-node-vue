<template>
  <div class="game-info">
    <game-time
      v-if="startTime"
      :start-time="startTime"
      class="game-info__timer"
    />
    <game-id
      v-if="id"
      :id="id"
      class="game-info__id"
    />
    <game-turn
      v-if="turnQuantity"
      :turn-quantity="turnQuantity"
      class="game-info__turn"
    />
  </div>
</template>

<script>
import GameId from '@/components/games/GameId.vue';
import GameTurn from '@/components/games/GameTurn.vue';
import GameTime from '@/components/games/GameTime.vue';

export default {
  name: 'GameInfo',
  components: {
    GameId,
    GameTurn,
    GameTime,
  },
  props: {
    startTime: {
      type: String,
      default: null,
    },
    id: {
      type: String,
      default: null,
    },
    turnQuantity: {
      type: Number,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
.game-info {
  display: grid;
  grid-template-areas: "timer turn" "id id";
  gap: 0.5rem;

  &__timer {
    grid-area: timer;
  }

  &__turn {
    grid-area: turn;
  }

  &__id {
    grid-area: id;
  }
}
</style>
