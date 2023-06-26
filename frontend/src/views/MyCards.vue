<template>
  <div class="my-cards">
    <h1>
      <i class="nes-icon is-large star" />&nbsp;My cards&nbsp;<i class="nes-icon is-large star" />
    </h1>
    <cards-table />
  </div>
</template>

<script>
import CardsTable from '@/components/cards/CardsTable.vue';

export default {
  name: 'MyCards',
  components: {
    CardsTable,
  },
  setup() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>
.my-cards {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  height: 100%;
}
</style>
