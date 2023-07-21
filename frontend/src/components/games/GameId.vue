<template>
  <div class="game-id nes-badge is-splited">
    <span class="is-dark">Game ID</span>
    <span class="is-primary">{{ id.toUpperCase() }}</span>
  </div>
</template>

<script>
export default {
  name: 'GameId',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.game-id {
  width: 250px;
}
</style>
