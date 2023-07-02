import { defineStore } from 'pinia';

import $API from '@/plugins/axios';

export const useCardStore = defineStore('cardStore', {
  state: () => ({
    isCardLoading: false,
    isUserCardsLoading: false,
    userCards: [],
    userCardsCount: 0,
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

    /**
     * Get user's cards
     * @param {{ offset: number; limit: number; order: string }} options
     */
    async getUserCards(options) {
      this.isUserCardsLoading = true;
      try {
        const { data: { data, count } } = await $API.get('/collection', { params: options });
        this.userCards = data;
        this.userCardsCount = count;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isUserCardsLoading = false;
      }
    },

    async getUserCardIds() {
      this.isUserCardIdsLoading = true;
      try {
        const { data } = await $API.get('/collection/all-ids');
        this.userCardIds = data;
        return data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isUserCardIdsLoading = false;
      }
    },
  },
});
