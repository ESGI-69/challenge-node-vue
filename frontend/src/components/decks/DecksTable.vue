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
      <div class="decks-table__header__favorite-deck">
        <span class="decks-table__header__favorite-deck__label">Favorite:</span>
        <div class="nes-select">
          <select
            id="select-fav-deck"
            required
            @change="selectFavDeck"
          >
            <option
              v-if="idDeckFav === null"
              value=""
              selected
            >
              Aucun
            </option>
            <option
              v-else
              value=""
              hidden
              disabled
            >
              Aucun
            </option>
            <template
              v-for="deck in validDecks"
              :key="deck.id"
            >
              <option
                v-if="deck.id === idDeckFav"
                selected
                :value="deck.id"
              >
                {{ deck.name }}
              </option>
              <option
                v-else
                :value="deck.id"
              >
                {{ deck.name }}
              </option>
            </template>
          </select>
        </div>
      </div>
      <div class="decks-table__header__order">
        <button
          class="decks-table__decks__create-button nes-btn is-primary"
          @click="isCreateModalOpen = true"
        >
          New deck
        </button>
      </div>
    </div>
    <div
      v-if="!isLoading && decks.length === 0 && nameFilter === ''"
      class="decks-table__empty"
    >
      <p>
        You don't have any decks yet.
      </p>
    </div>
    <div
      v-else-if="!isLoading && decks.length === 0 && nameFilter !== ''"
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
      <span
        v-for="deck in decks"
        :key="deck.id"
        class="decks-table__decks__deck"
      >
        <router-link
          :to="{ name: 'deck', params: { id: deck.id } }"
          class="decks-table__decks__deck__router"
        >
          <deck
            v-bind="deck"
          />
        </router-link>

        <img
          class="decks-table__decks__deck__delete"
          :src="Trash"
          alt="Trash"
          @click="deleteDeck(deck.id)"
        >

      </span>
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

import Deck from '@/components/Deck.vue';
import Container from '@/components/Container.vue';
import Modal from '@/components/Modal.vue';

import Trash from '@/assets/delete.png';

import { useDeckStore } from '@/stores/deckStore';
import { useProfileStore } from '@/stores/profileStore';

export default {
  name: 'DecksTable',
  components: {
    Deck,
    Modal,
    Container,
  },
  setup() {
    const deckStore = useDeckStore();
    const profileStore = useProfileStore();

    const deckPerRow = 4;

    const idDeckFav = computed(() => profileStore.profile.idDeckFav);

    const isLoading = computed(() => deckStore.isUserDecksLoading);
    const isCreateModalOpen = ref(false);
    const decks = computed(() => deckStore.decks);
    const validDecks = computed(() => deckStore.validDecks);
    const nameFilter = ref('');
    const newDeckName = ref('');

    const getDecks = () => {
      if (nameFilter.value !== '') {

        const options = {
          name: nameFilter.value,
        };
        deckStore.getUserDecks(options);
      } else {
        deckStore.getDecks();
      }
    };

    getDecks();

    const getValidDecks = () => {
      deckStore.getValidDecks();
    };

    getValidDecks();

    const deleteDeck = (id) => {
      deckStore.deleteDeck(id);
    };

    const selectFavDeck = (event) => {
      if (event.target.value !== '') {
        profileStore.updateDeckFav(event.target.value);
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
      createDeck,
      deckPerRow,
      decks,
      deleteDeck,
      getDecks,
      getValidDecks,
      idDeckFav,
      isCreateModalOpen,
      isLoading,
      nameFilter,
      newDeckName,
      resetNameFilter,
      setNameFilter,
      selectFavDeck,
      Trash,
      validDecks,
    };
  },
};
</script>
<style lang="scss" scoped>
.decks-table {

  height: 100%;
  width: 100%;

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

    &__favorite-deck{
      display: flex;
      flex-direction: row;
      width: 30rem;
       &__label{
        display: flex;
        align-items: center;
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

    &__deck{
      position: relative;
      width: fit-content;

      &:hover{
        .decks-table__decks__deck__router{
          opacity: 0.8;
          filter: drop-shadow(12px 7px 12px #000);
        }
        .decks-table__decks__deck__delete{
          display: flex;
        }
      }

      &__delete{
        position: absolute;
        top: 0;
        right: 0;
        display: none;
        height: 2rem;
        width: 2rem;
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
    width: 100%;
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
