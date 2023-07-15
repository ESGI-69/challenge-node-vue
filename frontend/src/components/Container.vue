<template>
  <div
    class="nes-container"
    :class="{
      'with-title': !!title,
      'is-rounded': isRounded,
      'is-centered': isCentered,
    }"
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
    isRounded: {
      type: Boolean,
      default: false,
    },
    isCentered: {
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
  overflow: hidden;

  .title {
    font-weight: normal;
  }
}
</style>
