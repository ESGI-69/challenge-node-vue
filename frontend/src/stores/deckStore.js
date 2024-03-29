import { defineStore } from 'pinia';

import $API from '@/plugins/axios';

export const useDeckStore = defineStore('deckStore', {
  state: () => ({
    isDeckLoading: false,
    isUserDecksLoading: false,
    isUserDeckLoading: false,
    isUserDeckIdsLoading: false,
    msgError: '',
    userDecks: [],
    userDecksCount: 0,
    /**
    * @type {number[]}
    */
    userDeckIds: [],
    decks: [],
    validDecks: [],
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
    async getDeck(id) {
      this.isUserDeckIdsLoading = true;
      try {
        const { data } = await $API.get(`/decks/${  id}`);

        this.deck = data;

      } catch (err) {
        throw err.response.data;
      } finally {
        this.isUserDeckIdsLoading = false;
      }
    },
    async removeCardFromDeck(idDeck, idCard) {
      this.isUserDeckIdsLoading = true;
      try {
        await $API.delete(`/decks/${idDeck}/cards`, { params:{
          cardId: idCard,
        } });

        const { data } = await $API.get(`/decks/${idDeck}`);

        this.deck = data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isUserDeckIdsLoading = false;
      }
    },
    async addCardFromDeck(idDeck, idCard) {
      this.isUserDeckIdsLoading = true;
      try {
        const { data } = await $API.post(`/decks/${idDeck}/cards`, {
          cardId: idCard,
        });

        this.deck = data;
        this.msgError = '';
      } catch (err) {
        if (err.response.status === 400 && err.response.data.reason==='Deck is full') {
          this.msgError = err.response.data.reason;
        } else {
          throw err.response.data;
        }
      } finally {
        this.isUserDeckIdsLoading = false;
      }
    },
    async deleteDeck(idDeck) {
      this.isUserDeckIdsLoading = true;
      try {
        await $API.delete(`/decks/${idDeck}`);

        const cleanedDecks = this.decks.filter((deck) => deck.id !== idDeck);

        this.decks = cleanedDecks;

      } catch (err) {
        throw err.response.data;
      } finally {
        this.isUserDeckIdsLoading = false;
      }
    },
    async updateDeck(idDeck, options) {
      this.isUserDecksLoading = true;
      try {
        const { data } = await $API.patch(`/decks/${idDeck}`, { params: options });
        this.deck = data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isUserDecksLoading = false;
      }
    },
    async getValidDecks() {
      this.isUserDecksLoading = true;
      try {
        const { data } = await $API.get('/decks/valid-decks');
        this.validDecks = data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isUserDecksLoading = false;
      }
    },
    resetMsgError() {
      this.msgError = '';
    },
  },
});

