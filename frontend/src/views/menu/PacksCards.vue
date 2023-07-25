<template>
  <div class="packs-cards">
    <router-link
      :to="{ name: 'shop' }"
      class="nes-btn is-primary"
    >
      Shop
    </router-link>
    <router-link
      :to="{ name: 'cards' }"
      class="nes-btn"
    >
      My Cards
    </router-link>
    <router-link
      :to="{ name: 'packs' }"
      class="nes-btn"
    >
      My Packs
    </router-link>
    <router-link
      :to="{ name: 'decks' }"
      class="nes-btn"
    >
      My Decks
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'PacksCardsView',
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.packs-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  width: 100%;
}
</style>
