import { defineStore } from 'pinia';

import $API from '@/plugins/axios';

export const useDeckStore = defineStore('deckStore', {
  state: () => ({
    isDeckLoading: false,
    isUserDecksLoading: false,
    isUserDeckLoading: false,
    isUserDeckIdsLoading: false,
    userDecks: [],
    userDecksCount: 0,
    /**
    * @type {number[]}
    */
    userDeckIds: [],
    decks: [],
    deck: {},
  }),

  getters: {
    totalDecksCount: (state) => state.userDeckIds.length,
  },

  actions: {
    async getDecks() {
      this.isDeckLoading = true;
      try {
        const { data } = await $API.get('/decks/my-decks');
        this.decks = data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isDeckLoading = false;
      }
    },

    /**
       * Get user's decks
       * @param {{ offset: number; limit: number; order: string }} options
       */
    async getUserDecks(options) {
      this.isUserDecksLoading = true;
      try {
        const { data: { decks, count } } = await $API.get('/decks/search-my-decks', { params: options });

        this.decks = decks;
        this.userDecksCount = count;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isUserDecksLoading = false;
      }
    },

    async getUserDeckIds() {
      this.isUserDeckIdsLoading = true;
      try {
        const { data } = await $API.get('/collection/all-decks-ids');
        this.userDeckIds = data;
        return data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isUserDeckIdsLoading = false;
      }
    },

    async createDeck(options) {
      this.isUserDeckIdsLoading = true;
      try {
        const { data } = await $API.post('/decks', { params: options });

        this.decks.push(data);
        return data;
      } catch (err) {
        throw err.response.data;
      }
    },
  },
});

