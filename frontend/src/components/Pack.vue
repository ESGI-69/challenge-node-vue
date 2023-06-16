<template>
  <div
    class="pack"
  >
    <img
      class="pack__invisible-image"
      :src="cardPackImage"
    >
    <span class="pack__number">
      No. {{ id }}
    </span>
  </div>
</template>

<script>
import cardPackImage from '@/assets/card-pack.webp';

export default {
  name: 'Pack',
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  setup() {
    return {
      cardPackImage,
    };
  },
};
</script>

<style lang="scss" scoped>
.pack {
  position: relative;
  background-size: cover;
  padding-top: 163%;
  overflow: hidden;

  &__invisible-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
  }

  &__number {
    padding: 0 1rem;
    position: absolute;
    left: 50%;
    bottom: 30%;
    background-color: white;
    z-index: 11;
    transform: translateX(-50%);
  }
}
</style>
