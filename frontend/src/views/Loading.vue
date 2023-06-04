<template>
  <div
    class="loading"
    :style="{ backgroundImage: `url(${wall})` }"
  >
    <h1>
      Loading...
    </h1>
    <progress
      class="nes-progress is-dark is-primary"
      value="80"
      max="100"
    />
  </div>
</template>

<script>
import wall from '@/assets/tiling_wall.png';

export default {
  name: 'Loading',
  setup() {
    return {
      wall,
    };
  },
};
</script>

<style lang="scss" scoped>
.loading {
  color: white;
  display: flex;
  height: 100%;
  width: 100%;
  background-size: 200px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  padding: 6rem;

  h1 {
    font-weight: normal;
  }
}
</style>
