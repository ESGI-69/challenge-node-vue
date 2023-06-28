<template>
  <div
    class="card-cost"
    :class="{
      'card-cost--is-clickable': isClickable,
      'card-cost--is-selected': isSelected,
    }"
    @[clickEvent]="$emit('click', cost)"
  >
    {{ cost }}
  </div>
</template>

<script>
import { computed, toRefs } from 'vue';
export default {
  name: 'CardCost',
  props: {
    isClickable: {
      type: Boolean,
      default: false,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    cost: {
      type: Number,
      required: true,
    },
  },
  emits: [ 'click' ],
  setup(props) {
    const { isClickable } = toRefs(props);

    const clickEvent = computed(() => isClickable.value ? 'click' : null);
    return {
      clickEvent,
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
  background-color: blue;

  &--is-clickable {
    cursor: pointer;
  }

  &--is-selected {
    background-color: lightskyblue;
  }
}
</style>
