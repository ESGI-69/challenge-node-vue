<template>
  <div class="game-time nes-badge">
    <span class="is-warning">{{ timeSinceStart }}</span>
  </div>
</template>

<script>
import { ref, toRefs } from 'vue';

export default {
  name: 'GameId',
  props: {
    startTime: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { startTime } = toRefs(props);

    const timeSinceStart = ref('');

    const refreshTime = () => {
      const now = new Date();
      const start = new Date(startTime.value);

      const diff = now - start;

      const minutes = Math.floor(diff / 1000 / 60) % 60;
      const seconds = Math.floor(diff / 1000) % 60;

      timeSinceStart.value = `${minutes}m ${seconds}s`;
    };

    refreshTime();
    setInterval(() => refreshTime(), 500);

    return {
      timeSinceStart,
    };
  },
};
</script>

<style lang="scss" scoped>
// .game-time {
//   width: 250px;
// }
</style>
