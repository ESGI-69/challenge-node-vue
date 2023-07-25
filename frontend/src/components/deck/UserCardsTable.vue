<template>
  <container class="cards-table">
    <div class="cards-table__header">
      <div class="cards-table__header__filters">
        <span>
          Cost:
        </span>
        <card-cost
          v-for="cost in 10"
          :key="cost"
          :cost="cost"
          :is-clickable="true"
          :is-empty="costFilter !== cost"
          @click="setCostFilter"
        />
      </div>
      <div class="cards-table__header__order">
        <label
          for="order"
          class="cards-table__header__order__label"
        >
          Order by
        </label>
        <div class="nes-select">
          <select
            id="order"
            v-model="order"
            class="nes-select"
            @change="getCards"
          >
            <option value="cost">
              Cost [0-9]
            </option>
            <option value="-cost">
              Cost [9-0]
            </option>
            <option value="name">
              Name [A-Z]
            </option>
            <option value="-name">
              Name [Z-A]
            </option>
            <option value="attack">
              Attack [0-9]
            </option>
            <option value="-attack">
              Attack [9-0]
            </option>
            <option value="health">
              Health [0-9]
            </option>
            <option value="-health">
              Health [9-0]
            </option>
          </select>
        </div>
      </div>
    </div>
    <div
      v-if="!isLoading && cards.length === 0 && costFilter === null"
      class="cards-table__empty"
    >
      <p>
        You don't have any cards yet.
      </p>
      <router-link
        to="/cards"
        class="nes-btn is-primary"
      >
        Buy cards
      </router-link>
    </div>
    <div
      v-else-if="!isLoading && cards.length === 0 && costFilter !== null"
      class="cards-table__empty"
    >
      <p>
        You don't have any cards with this cost ({{ costFilter }}).
      </p>
      <button
        class="nes-btn is-primary"
        @click="resetCostFilter"
      >
        Reset filter
      </button>
    </div>
    <div
      v-else-if="!isLoading"
      class="cards-table__cards"
    >
      <card
        v-for="card in cards"
        :key="card.id"
        v-bind="card"
        @click="addCardFromDeck(card.id)"
      />
    </div>
    <div
      v-else
      class="cards-table__loading"
    >
      <p>Loading...</p>
    </div>
    <transition name="fade">
      <card-detail
        v-if="!!selectedCard"
        :card="selectedCard"
        @close="selectedCard = null"
      />
    </transition>
  </container>
</template>

<script>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import Card from '@/components/Card.vue';
import Container from '@/components/Container.vue';
import CardCost from '@/components/card/CardCost.vue';
import CardDetail from '@/components/CardDetail.vue';

import { useCardStore } from '@/stores/cardStore';
import { useDeckStore } from '@/stores/deckStore';

export default {
  name: 'CardsTable',
  components: {
    Card,
    CardCost,
    CardDetail,
    Container,
  },
  setup() {
    const cardStore = useCardStore();
    const deckStore = useDeckStore();

    const route = useRoute();

    const deckId = route.params.id;

    const cardPerRow = 3;

    const isLoading = computed(() => cardStore.isUserCardsLoading);
    const cards = computed(() => cardStore.userCards);
    const totalCards = computed(() => cardStore.userCardsCount);
    const totalPages = computed(() => Math.ceil(totalCards.value / 6));
    const currentPage = ref(1);
    const order = ref('cost');
    const costFilter = ref(null);
    const selectedCard = ref(null);

    const getCards = () => {
      const options = {
        offset: (currentPage.value - 1) * 6,
        // limit: cardPerPage,
        order: order.value,
        cost: costFilter.value,
      };
      cardStore.getUserCards(options);
    };

    const addCardFromDeck = (cardId) => {
      deckStore.addCardFromDeck(deckId, cardId);
    };

    // Load cards on created
    getCards();

    const changePage = (page) => {
      if (page === currentPage.value) return;
      currentPage.value = page;
      getCards();
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value -= 1;
        getCards();
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value += 1;
        getCards();
      }
    };

    const setCostFilter = (cost) => {
      if (costFilter.value === cost) {
        costFilter.value = null;
      } else {
        costFilter.value = cost;
      }
      getCards();
    };

    const resetCostFilter = () => {
      costFilter.value = null;
      getCards();
    };

    return {
      addCardFromDeck,
      cardPerRow,
      cards,
      changePage,
      costFilter,
      currentPage,
      getCards,
      isLoading,
      nextPage,
      order,
      previousPage,
      resetCostFilter,
      selectedCard,
      setCostFilter,
      totalCards,
      totalPages,
    };
  },
};
</script>

<style lang="scss" scoped>
.cards-table {
  display: flex;
  flex-direction: column;
  width: 75%;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 2rem;

    &__filters {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      span {
        margin-right: 0.5rem;
      }
    }

    &__order {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      select {
        width: 250px;
      }

      label {
        margin: 0;
        white-space: nowrap;
      }
    }
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(v-bind(cardPerRow), 1fr);
    gap: 1rem;
  }

  &__loading, &__empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    height: 752px;
    width: 1136px;
  }

  &__footer {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
