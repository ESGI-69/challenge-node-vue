<template>
  <container class="my-deck">
    <h1 class="my-deck__title">
      {{ deckName }}
      <img
        class="my-deck__edit"
        :src="Edit"
        alt="Edit"
        @click="isEditModalOpen = true"
      >
    </h1>
    <div class="my-deck__ctnr-deck-vue">
      <user-cards-table />
      <deck-cards-table />
    </div>
    <modal
      v-model:isOpen="isEditModalOpen"
      @confirm="updateDeck"
    >
      <template #header>
        <h2>Edit deck name</h2>
      </template>
      <div class="nes-field">
        <label for="name">Name</label>
        <input
          id="name"
          v-model="newDeckName"
          type="text"
          class="nes-input"
          @keyup.enter="updateDeck"
        >
      </div>
      <template #confirm>
        <span>Update</span>
      </template>
    </modal>
  </container>
</template>

<script>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import UserCardsTable from '@/components/deck/UserCardsTable.vue';
import DeckCardsTable from '@/components/deck/DeckCardsTable.vue';
import Container from '@/components/Container.vue';
import Modal from '@/components/Modal.vue';

import Edit from '@/assets/edit.png';

import { useDeckStore } from '@/stores/deckStore';


export default {
  name: 'DeckCards',
  components: {
    Container,
    DeckCardsTable,
    Modal,
    UserCardsTable,
  },
  setup() {
    const deckStore = useDeckStore();

    const route = useRoute();

    const deckId = route.params.id;

    const deckName = computed(() => deckStore.deck.name);
    const isEditModalOpen = ref(false);
    const newDeckName = ref('');

    const updateDeck = () => {
      if (!newDeckName.value || newDeckName.value === '') return;
      const options = {
        name: newDeckName.value,
      };

      deckStore.updateDeck(deckId, options);
      isEditModalOpen.value = false;
    };

    return {
      updateDeck,
      deckId,
      deckName,
      Edit,
      isEditModalOpen,
      newDeckName,
    };
  },
};
</script>

<style lang="scss" scoped>
.my-deck {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  width: 100%;
  overflow: hidden;
  justify-content: center;
  align-items: center;

  &__ctnr-deck-vue{
    display: flex;
    flex-direction: row;
    gap: 3rem;
    height: 100%;
    width: 100%;
    margin-bottom: 1rem;
  }

  &__title{
    margin-top: 2rem;
  }

  &__edit{
    width: 2rem;
    height: 2rem;
    margin-top: -1rem;

    &:hover{
      cursor: pointer;
      filter: invert(0.5) sepia(1) saturate(3) hue-rotate(180deg);
    }
  }
}
</style>
