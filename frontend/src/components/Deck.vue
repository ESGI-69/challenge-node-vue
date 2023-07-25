<template>
  <div
    class="deck"
  >
    <div
      class="deck__container"
    >
      <div
        class="deck__container__back"
        :style="{ backgroundImage: `url(${imageUrl})` }"
      >
        <span class="deck__container__back__name">
          {{ name }}
        </span>
      </div>
    </div>
  </div>
</template>


<script>
// import { toRefs, ref, computed } from 'vue';
import { computed } from 'vue';

import backOfDeck from '@/assets/backOfCardResized.webp';

export default {
  name: 'Deck',
  props: {
    /**
     * The id of the deck.
     */
    id: {
      type: Number,
      default: null,
    },
    /**
     * The name of the deck.
     */
    name: {
      type: String,
      default: null,
    },
  },
  setup() {
    const imageUrl = computed(() => backOfDeck);

    return {
      imageUrl,
    };
  },
};
</script>

<style lang="scss" scoped>
.deck {
  user-select: none;
  width: 17rem;
  height: 23rem;
  perspective: 27rem;

  &__container {
    position: relative;
    height: calc(100% - 2rem);
    transition: transform 1s;
    transform-style: preserve-3d;
    margin: 1rem;

    &__back {
      position: absolute;
      height: 100%;
      width: 100%;
      border: 4px solid black;
      background-size: cover;
      background-position: center;
      // transform: rotateY( 180deg );

      &__name {
        box-sizing: border-box;
        width: calc(100% - 4rem);
        margin: 0 2rem;
        background-color: #a600ff;
        color: white;
        position: absolute;
        height: 4rem;
        font-size: 1.25rem;
        bottom: 2rem;
        display: flex;
        justify-content: center;
        padding: 0 2rem;
        text-align: center;
      }
    }


  }
}
</style>
