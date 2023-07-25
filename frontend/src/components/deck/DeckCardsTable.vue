<template>
  <div class="deck-card">
    <div class="deck-card__header">
      <h1>
        Deck cards&nbsp;
        <span
          :class="{
            'deck-card__header__count--red': countCards < 5,
            'deck-card__header__count--green': countCards === 5,
          }"
        >
          ({{ countCards }}/5)
        </span>
      </h1>
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
          @click="removeCardFromDeck(card.id)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import DeckCard from '@/components/deck/DeckCard.vue';

import { useDeckStore } from '@/stores/deckStore';

export default {
  name: 'CardsTable',
  components: {
    DeckCard,
  },
  setup() {
    const deckStore = useDeckStore();
    const route = useRoute();

    const deckId = route.params.id;

    const deck = computed(() => deckStore.deck);
    const cards = computed(() => deckStore.deck.Cards);
    const countCards = computed(() => deckStore.deck.Cards?.length);
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
      countCards,
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
    border: solid 4px black;
    text-align: center;
    padding: 0 2rem;
    max-height: 98%;

    &__header{
        align-items: center;
        text-align: center;
        border-bottom: solid 2px black;
        margin-bottom: 2rem;

        h1{
          font-size: 1.3rem;
        }

        &__count{
          &--red{
            color: red;
          }

          &--green{
            color: green;
          }
        }
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

            &__btn-remove-card{
              height: 3rem;
            }
        }
    }
}
</style>
