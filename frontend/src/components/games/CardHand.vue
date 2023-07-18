<template>
  <div
    class="card-hand"
  >
    <template v-if="isEnemy">
      <div
        v-for="card in cardsFixedQuantity"
        :key="card"
        class="card-hand__card-wrapper card-hand__card-wrapper--is-enemy"
      >
        <card
          class="card-hand__card-wrapper__card"
          :is-start-face-down="true"
          :is-front-hidden="true"
        />
      </div>
    </template>
    <draggable
      v-else
      v-model="cardsDraggable"
      :group="{
        name: 'cards',
        put: false,
      }"
      item-key="id"
      class="card-hand"
      animation="150"
      @remove="onRemove"
    >
      <template #item="{ element }">
        <div
          class="card-hand__card-wrapper nes-pointer"
        >
          <card
            class="card-hand__card-wrapper__card"
            v-bind="element"
          />
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import { computed, toRefs, ref } from 'vue';

import Draggable from 'vuedraggable';
import Card from '@/components/Card.vue';

export default {
  name: 'CardHand',
  components: {
    Card,
    Draggable,
  },
  props: {
    cards: {
      type: Array,
      default: () => [],
    },
    cardsFixedQuantity: {
      type: Number,
      default: 0,
    },
    isEnemy: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { cards, cardsFixedQuantity, isEnemy } = toRefs(props);

    const cardsQuantity = computed(() => isEnemy.value ? cardsFixedQuantity.value : cards.value.length);

    /**
     * Computed with get set
     */
    const cardsDraggable = ref(cards.value);

    const onRemove = () => {
      // When a card is removed from the hand of the player
      // console.log('onRemove');
    };

    return {
      onRemove,
      cardsQuantity,
      cardsDraggable,
    };
  },
};
</script>

<style lang="scss" scoped>
@use 'sass:math';

.card-hand {
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;

  &__card-wrapper {
    margin: 0 -75px;
    position: relative;

    &--is-enemy {
      pointer-events: none;
    }

    &:after {
      bottom: 0;
      content: '';
      left: -60px;
      position: absolute;
      right: -60px;
      top: 0px;
      z-index: 10;
      // background-color: rgba($color: red, $alpha: 0.2);
    }

    &:hover {
      .card-hand__card-wrapper__card {
        transform: translateY(-175px) scale(1.5);
        transition-duration: 0ms;
        z-index: 5;

        &:after {
          animation: fade 250ms ease-out forwards;
        }
      }
      &:after {
        top: -275px;
      }
    }

    &__card {
      bottom: 0;
      content: '';
      left: 0;
      pointer-events: none;
      position: relative;
      right: 0;
      top: 0;
      transition: 800ms cubic-bezier(0.19, 1, 0.22, 1) transform;

      &:after {
        animation: none;
        background: #fff;
        bottom: 0;
        content: '';
        left: 0;
        opacity: 0;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
}

@keyframes fade {
  0% {
    opacity: 0.9;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.15);
  }
}
</style>
