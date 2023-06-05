import { defineStore } from 'pinia';

import $API from '@/plugins/axios';

export const useCardStore = defineStore('cardStore', {
  state: () => ({
    isCardLoading: false,
    cards: [],
    card: {},
  }),

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
  },
});
