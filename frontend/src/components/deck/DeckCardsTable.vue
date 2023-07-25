<template>
  <container class="deck-card">
    <div class="deck-card__header">
      <h1>Deck cards</h1>
    </div>
    <div
      class="deck-card__list"
    >
      <div
        v-for="card in cards"
        :key="card.id"
        class="deck-card__list__item"
      >
        <deck-card
          :id="card.id"
          :name="card.name"
          :cost="card.cost"
        />
        <button
          class="nes-btn is-error"
          @click="removeCardFromDeck(card.id)"
        >
          -
        </button>
      </div>
    </div>
  </container>
</template>

<script>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import Container from '@/components/Container.vue';

import DeckCard from '@/components/deck/DeckCard.vue';

import { useDeckStore } from '@/stores/deckStore';

export default {
  name: 'CardsTable',
  components: {
    DeckCard,
    Container,
  },
  setup() {
    const deckStore = useDeckStore();
    const route = useRoute();

    const deckId = route.params.id;

    const deck = computed(() => deckStore.deck);
    const cards = computed(() => deckStore.deck.Cards);
    // const isUserDeckIdsLoading = computed(() => deckStore.isUserDeckIdsLoading);

    const getDeck = () => {
      deckStore.getDeck(deckId);
    };

    const removeCardFromDeck = (cardId) => {
      deckStore.removeCardFromDeck(deckId, cardId);
    };

    getDeck();

    return {
      cards,
      deckId,
      deck,
      getDeck,
      removeCardFromDeck,
    };
  },
};
</script>

<style lang="scss" scoped>
.deck-card{
    display: flex;
    flex-direction: column;
    width: 25%;

    &__header{
        align-items: center;
        text-align: center;
        border-bottom: solid 2px black;
        margin-bottom: 2rem;
    }

    &__list{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        white-space: nowrap;

        &__item{
            display: flex;
            flex-direction: row;
            white-space: nowrap;

            &__btn-add-card{
                white-space: nowrap;
            }
        }
    }
}
</style>
