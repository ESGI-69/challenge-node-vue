<template>
  <div class="cards-table">
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
      <span
        v-for="card in filteredCards"
        :key="card.id"
        class="cards-table__cards__card"
      >
        <card
          v-bind="card"
        />
        <span
          class="cards-table__cards__card__add"
          @click="addCardFromDeck(card.id)"
        >
          +
        </span>
      </span>
    </div>
    <div
      v-else
      class="cards-table__loading"
    >
      <p>Loading...</p>
    </div>
  </div>
  <modal-error
    v-model:isOpen="isErrorModalOpen"
    @cancel="closeModalError"
  >
    <template #header>
      <h2>Error</h2>
    </template>
    <div class="nes-field">
      <p>
        {{ msgError }}
      </p>
    </div>
  </modal-error>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import Card from '@/components/Card.vue';
import CardCost from '@/components/card/CardCost.vue';
import ModalError from '@/components/ModalError.vue';

import { useCardStore } from '@/stores/cardStore';
import { useDeckStore } from '@/stores/deckStore';

export default {
  name: 'CardsTable',
  components: {
    Card,
    CardCost,
    ModalError,
  },
  setup() {
    const cardStore = useCardStore();
    const deckStore = useDeckStore();

    const route = useRoute();

    const deckId = route.params.id;

    const cardPerRow = 4;

    const isLoading = computed(() => cardStore.isUserCardsLoading);
    const deckCards = computed(() => deckStore.deck?.Cards);
    const cards = computed(() => cardStore.userCards);
    const msgError = computed(() => deckStore.msgError);
    const isErrorModalOpen = ref(false);

    const filteredCards = computed(() => {
      if (deckCards.value.length === 0){
        return cards.value;
      }
      const deckCardIds = new Set(deckCards.value.map(card => card.id));
      return cards.value.filter(card => !deckCardIds.has(card.id));
    });

    const totalCards = computed(() => cardStore.userCardsCount);
    const order = ref('cost');
    const costFilter = ref(null);

    const closeModalError = () => {
      isErrorModalOpen.value = false;
      deckStore.resetMsgError();
    };

    watch(msgError, (newVal) => {
      isErrorModalOpen.value = newVal !== '';
    });

    const getCards = () => {
      const options = {
        order: order.value,
        cost: costFilter.value,
      };
      cardStore.getUserCards(options);
    };

    const addCardFromDeck = (cardId) => {
      deckStore.addCardFromDeck(deckId, cardId);

      // if (msgError.value !== '') {
      //   isErrorModalOpen.value = true;
      // }
    };

    // Load cards on created
    getCards();

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
      closeModalError,
      costFilter,
      deckCards,
      isErrorModalOpen,
      filteredCards,
      getCards,
      isLoading,
      msgError,
      order,
      resetCostFilter,
      setCostFilter,
      totalCards,
    };
  },
};
</script>

<style lang="scss" scoped>
.cards-table {
  display: flex;
  flex-direction: column;
  width: 75%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
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
    width: fit-content;
    grid-template-columns: repeat(v-bind(cardPerRow), 1fr);
    gap: 1rem;
    overflow-y: scroll;

    &__card {
      position: relative;
      display: grid;

      &:hover{
        .cards-table__cards__card__add{
          display: flex;
        }
      }

      &__add{
        position: absolute;
        width: 100%;
        height: 100%;
        color: white;
        font-size: 5rem;
        padding: 50% 35%;
        display: none;
        background-color: rgba(0,0,0, 0.5);
      }
    }
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
