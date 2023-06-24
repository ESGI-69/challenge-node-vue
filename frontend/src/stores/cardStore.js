import { defineStore } from 'pinia';

import $API from '@/plugins/axios';

export const useCardStore = defineStore('cardStore', {
  state: () => ({
    isCardLoading: false,
    isUserCardsLoading: false,
    userCards: [],
    cards: [],
    card: {},
  }),

  getters: {
    userCardsCount: (state) => state.userCards.length,
  },

  actions: {
    async getCards() {
      this.isCardLoading = true;
      try {
        const { data } = await $API.get('/cards');
        this.cards = data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isCardLoading = false;
      }
    },

    async getUserCards() {
      this.isUserCardsLoading = true;
      try {
        const { data } = await $API.get('/collection');
        this.userCards = data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isUserCardsLoading = false;
      }
    },
  },
});
