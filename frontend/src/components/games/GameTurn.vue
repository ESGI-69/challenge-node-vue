<template>
  <div class="game-turn nes-badge is-splited">
    <span class="is-dark">Turn</span>
    <span class="is-primary">{{ turnQuantity }}</span>
  </div>
</template>

<script>
export default {
  name: 'GameTurn',
  props: {
    turnQuantity: {
      type: Number,
      required: true,
    },
  },
};
</script>
