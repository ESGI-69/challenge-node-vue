<template>
  <container class="decks-table">
    <div class="decks-table__header">
      <div class="decks-table__header__filters">
        <span>
          Name:
        </span>
        <input
          v-model="nameFilter"
          type="text"
          class="nes-input name-filter"
          @input="setNameFilter"
        >
      </div>
      <div class="decks-table__header__order">
        <button
          class="decks-table__decks__create-button nes-btn is-primary"
          @click="isCreateModalOpen = true"
        >
          Create new deck
        </button>
      </div>
    </div>
    <div
      v-if="!isLoading && decks.length === 0 && nameFilter === null"
      class="decks-table__empty"
    >
      <p>
        You don't have any decks yet.
      </p>
    </div>
    <div
      v-else-if="!isLoading && decks.length === 0 && nameFilter !== null"
      class="decks-table__empty"
    >
      <p>
        You don't have any decks with this name ({{ nameFilter }}).
      </p>
      <button
        class="nes-btn is-primary"
        @click="resetNameFilter"
      >
        Reset filter
      </button>
    </div>
    <div
      v-else-if="!isLoading"
      class="decks-table__decks"
    >
      <router-link
        v-for="deck in decks"
        :key="deck.id"
        :to="{ name: 'deck', params: { id: deck.id } }"
      >
        <deck
          v-bind="deck"
        />
      </router-link>
    </div>
    <div
      v-else
      class="decks-table__loading"
    >
      <p>Loading...</p>
    </div>
    <modal
      v-model:isOpen="isCreateModalOpen"
      @confirm="createDeck"
    >
      <template #header>
        <h2>Create new deck</h2>
      </template>
      <div class="nes-field">
        <label for="name">Name</label>
        <input
          id="name"
          v-model="newDeckName"
          type="text"
          class="nes-input"
        >
      </div>
      <template #confirm>
        <span>Create</span>
      </template>
    </modal>
  </container>
</template>

<script>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import Deck from '@/components/Deck.vue';
import TablePagination from './TablePagination.vue';
import Container from '@/components/Container.vue';
import Modal from '@/components/Modal.vue';

import { useDeckStore } from '@/stores/deckStore';

export default {
  name: 'DecksTable',
  components: {
    Deck,
    Modal,
    Container,
    TablePagination,
  },
  setup() {
    const deckStore = useDeckStore();

    const deckPerPage = 8;
    const deckPerRow = deckPerPage / 2;

    const isLoading = computed(() => deckStore.isUserDecksLoading);
    const isCreateModalOpen = ref(false);
    const decks = computed(() => deckStore.decks);
    const totalDecks = computed(() => deckStore.userDecksCount);
    const totalPages = computed(() => Math.ceil(totalDecks.value / 6));
    const currentPage = ref(1);
    const nameFilter = ref('');
    const selectedDeck = ref(null);
    const newDeckName = ref('');

    const getDecks = () => {
      if (nameFilter.value !== null) {

        const options = {
          offset: (currentPage.value - 1) * 6,
          limit: deckPerPage,
          name: nameFilter.value,
        };
        deckStore.getUserDecks(options);
      } else {
        deckStore.getDecks();
      }
    };

    getDecks();

    const changePage = (page) => {
      if (page === currentPage.value) return;
      currentPage.value = page;
      getDecks();
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value -= 1;
        getDecks();
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value += 1;
        getDecks();
      }
    };

    const setNameFilter = () => {
      getDecks();
    };

    const resetNameFilter = () => {
      nameFilter.value = '';
      getDecks();
    };

    const createDeck = () => {
      const options = {
        name: newDeckName.value,
      };

      deckStore.createDeck(options);
      isCreateModalOpen.value = false;
    };

    return {
      deckPerRow,
      isCreateModalOpen,
      isLoading,
      decks,
      getDecks,
      currentPage,
      totalPages,
      changePage,
      previousPage,
      nextPage,
      nameFilter,
      setNameFilter,
      resetNameFilter,
      selectedDeck,
      newDeckName,
      createDeck,
    };
  },
};
</script>
<style lang="scss" scoped>
.decks-table {
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

  &__decks {
    &__create-button {
      height: 3rem;
    }
    display: grid;
    grid-template-columns: repeat(v-bind(deckPerRow), 1fr);
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

  .name-filter {
    width: 15rem;
  }
}
</style>
