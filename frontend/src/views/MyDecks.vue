<template>
  <div class="decks">
    <h1>
      <i class="nes-icon is-large star" />&nbsp;My decks&nbsp;<i class="nes-icon is-large star" />
    </h1>
    <decks-table />
  </div>
</template>

<script>
import DecksTable from '@/components/decks/DecksTable.vue';

export default {
  name: 'MyDecks',
  components: {
    DecksTable,
  },
  setup() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>
  .decks {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    height: 100%;
  }
</style>

