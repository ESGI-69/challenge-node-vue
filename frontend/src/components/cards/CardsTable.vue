<template>
  <container class="cards-table">
    <div class="cards-table__header">
      <span class="cards-table__header__filters" />
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
      v-if="!isLoading"
      class="cards-table__cards"
    >
      <card
        v-for="card in cards"
        :key="card.id"
        v-bind="card"
      />
    </div>
    <div
      v-else
      class="cards-table__loading"
    >
      <p>Loading</p>
    </div>
    <div class="cards-table__footer">
      <table-pagination
        class="cards-table__footer__pagination"
        :current-page="currentPage"
        :total-pages="totalPages"
        @previous="previousPage"
        @change="changePage"
        @next="nextPage"
      />
      <span class="cards-table__footer__count">
        <span class="nes-text is-primary">
          {{ totalCards }}
        </span>
        Cards
      </span>
    </div>
  </container>
</template>

<script>
import { computed, ref } from 'vue';

import Card from '@/components/Card.vue';
import TablePagination from './TablePagination.vue';
import Container from '../Container.vue';

import { useCardStore } from '@/stores/cardStore';

export default {
  name: 'CardsTable',
  components: {
    Card,
    Container,
    TablePagination,
  },
  setup() {
    const cardStore = useCardStore();

    const isLoading = computed(() => cardStore.isUserCardsLoading);
    const cards = computed(() => cardStore.userCards);
    const totalCards = computed(() => cardStore.userCardsCount);
    const totalPages = computed(() => Math.ceil(totalCards.value / 6));
    const currentPage = ref(1);
    const order = ref('cost');

    const getCards = () => {
      const options = {
        offset: (currentPage.value - 1) * 6,
        limit: 6,
        order: order.value,
      };
      cardStore.getUserCards(options);
    };

    const changePage = (page) => {
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

    getCards();

    return {
      isLoading,
      cards,
      totalCards,
      totalPages,
      changePage,
      previousPage,
      nextPage,
      currentPage,
      order,
      getCards,
    };
  },
};
</script>

<style lang="scss" scoped>
.cards-table {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

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
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 752px;
    width: 848px;
  }

  &__footer {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
