<template>
  <div class="my-cards">
    <div
      v-for="card in cards"
      :key="card"
    >
      <card v-bind="card" />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import Card from '@/components/Card.vue';
import { useCardStore } from '@/stores/cardStore';

export default {
  name: 'MyCards',
  components: {
    Card,
  },
  setup() {
    const cardStore = useCardStore();

    const cards = computed(() => cardStore.cards);

    return {
      cards,
    };
  },
};
</script>

<style lang="scss" scoped>
.my-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}
</style>
