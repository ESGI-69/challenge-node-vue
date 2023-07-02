<template>
  <div
    class="card-detail"
    @click="$emit('close')"
  >
    <card
      v-bind="card"
      @click.stop
    />
    <container
      class="obtained-date"
      :title="'Obtained at:'"
      @click.stop
    >
      {{ obtainedDate }}
    </container>
    <button
      class="nes-btn is-error card-detail__close"
      @click="$emit('close')"
    >
      Close and back to your cards
    </button>
  </div>
</template>

<script>
import { computed } from 'vue';

import Card from './Card.vue';
import Container from './Container.vue';

export default {
  name: 'CardDetail',
  components: {
    Card,
    Container,
  },
  props: {
    card: {
      type: Number,
      required: true,
    },
  },
  emits: [ 'close' ],
  setup(props) {
    const obtainedDate = computed(() => {
      const date = new Date(props.card.obtainedAt);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    });

    return {
      obtainedDate,
    };
  },
};
</script>

<style lang="scss" scoped>
.card-detail {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  background-color: rgba($color: #000000, $alpha: 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2rem;
}
</style>
