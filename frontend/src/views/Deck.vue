<template>
  <div class="my-deck">
    <h1>
      <i class="nes-icon is-large star" />&nbsp;My deck&nbsp;<i class="nes-icon is-large star" />
    </h1>
    <div class="my-deck__ctnr-deck-vue">
      <user-cards-table />
      <deck-cards-table />
    </div>
  </div>
</template>

<script>
import UserCardsTable from '@/components/deck/UserCardsTable.vue';
import DeckCardsTable from '@/components/deck/DeckCardsTable.vue';


export default {
  name: 'DeckCards',
  components: {
    UserCardsTable,
    DeckCardsTable,
  },
  setup() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>
.my-deck {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  // align-items: center;
  gap: 1rem;
  height: 100%;

  &__ctnr-deck-vue{
    display: flex;
    flex-direction: row;
    gap: 3rem;
  }
}
</style>
