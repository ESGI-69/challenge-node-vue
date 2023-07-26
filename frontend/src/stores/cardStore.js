import { defineStore } from 'pinia';

import $API from '@/plugins/axios';

export const useCardStore = defineStore('cardStore', {
  state: () => ({
    isCardLoading: false,
    isUserCardsLoading: false,
    isUserCardLoading: false,
    isUserCardIdsLoading: false,
    isPostCardLoading: false,
    userCards: [],
    userCardsCount: 0,
    /**
     * @type {number[]}
     */
    userCardIds: [],
    cards: [],
    card: {},
  }),

  getters: {
    totalCardsCount: (state) => state.userCardIds.length,
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

    /**
     * Get user's cards
     * @param {{ offset: number; limit: number; order: string }} options
     */
    async getUserCards(options) {
      this.isUserCardsLoading = true;
      try {
        const { data: { cards, count } } = await $API.get('/collection', { params: options });
        this.userCards = cards;
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

    /**
     * Post a new card
     * @param {{ name: string, cost: number, rarity: string, type: string, attack: number, health: number, image: File }} payload The payload sent to the API
     * @returns {Promise<void>}
     */
    async postCard(payload) {
      this.isPostCardLoading = true;
      try {
        await $API.post('/cards', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isPostCardLoading = false;
      }
    },
  },
});
