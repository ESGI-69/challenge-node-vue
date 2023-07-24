<template>
  <div
    class="card-cost"
    :style="`background-image: url(${ManaCrystal})`"
    :class="{
      'card-cost--is-clickable': isClickable,
      'card-cost--is-empty': isEmpty,
    }"
    @[clickEvent]="$emit('click', cost)"
  >
    {{ cost }}
  </div>
</template>

<script>
import { computed, toRefs } from 'vue';

import ManaCrystal from '@/assets/mana-crystal.png';

export default {
  name: 'CardCost',
  props: {
    isClickable: {
      type: Boolean,
      default: false,
    },
    cost: {
      type: Number,
      required: true,
    },
    isEmpty: {
      type: Boolean,
      default: false,
    },
  },
  emits: [ 'click' ],
  setup(props) {
    const { isClickable } = toRefs(props);

    const clickEvent = computed(() => isClickable.value ? 'click' : null);
    return {
      clickEvent,
      ManaCrystal,
    };
  },
};
</script>

<style lang="scss" scoped>
.card-cost {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
  width: 2rem;
  color: white;
  border-radius: 50%;
  background-size: cover;
  background-position: center;

  &--is-clickable {
    cursor: pointer;
  }

  &--is-empty {
    filter: brightness(0.5);
  }
}
</style>
