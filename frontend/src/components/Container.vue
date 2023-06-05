<template>
  <div
    class="nes-container"
    :class="{ 'with-title': !!title }"
    :style="{ backgroundImage: hasWoodBackground ? `url(${wood})` : null }"
  >
    <h3
      v-if="!!title"
      class="title"
    >
      {{ title }}
    </h3>
    <slot />
  </div>
</template>

<script>
import wood from '@/assets/wood.jpg';

export default {
  name: 'Container',
  props: {
    title: {
      type: String,
      default: null,
    },
    hasWoodBackground: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
      wood,
    };
  },
};
</script>

<style lang="scss" scoped>
.nes-container {
  background-size: 192px;
  background-color: white;
  width: fit-content;

  .title {
    font-weight: normal;
  }
}
</style>