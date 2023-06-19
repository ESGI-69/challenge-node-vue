import { defineStore } from 'pinia';

import $API from '@/plugins/axios';

/**
 * @typedef {{
 *  id: number;
 *  name: string;
 *  openedAt: string;
 *  createdAt: string;
 * }} Pack A pack of cards
 */

export const usePackStore = defineStore('packStore', {
  state: () => ({
    isGetPacksLoading: false,
    /**
     * @type {Pack[]}
     */
    packs: [],
    /**
     * @type {Pack}
     */
    isPurchasePackLoading: false,
    purchasedPack: {},
    pack: {},

    // Open pack
    isOpenPackLoading: false,
    openningPack: false,
    cardObtained: [],
    /**
     * @type {number[]}
     */
    duplicatedCardIds: [],
    /**
     * @type {number}
     */
    refundedAmount: 0,
  }),

  getters: {
    packsCount: (state) => state.packs.length,
    unOpenedPacks: (state) => state.packs.filter((pack) => pack.openedAt === null),
    unOpenedPacksCount: (state) => state.unOpenedPacks.length,

    isPackOpen: (state) => state.pack?.openedAt !== null,
  },

  actions: {
    /**
     * Get all user's packs
     */
    async getPacks() {
      this.isGetPacksLoading = true;
      try {
        const { data } = await $API.get('/packs');
        this.packs = data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isGetPacksLoading = false;
      }
    },

    /**
     * Buy a pack
     */
    async purchasePack() {
      this.isPurchasePackLoading = true;
      try {
        const { data } = await $API.post('/packs/buy');
        this.purchasedPack = data.pack;
        this.packs.unshift(data.pack);
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isPurchasePackLoading = false;
      }
    },

    /**
     * Open a pack
     * @param {number} packId
     */
    async openPack(packId) {
      this.isOpenPackLoading = true;
      try {
        const { data } = await $API.post(`/packs/${packId}/open`);
        this.packs.splice(this.packs.findIndex((pack) => pack.id === packId), 1);
        this.cardObtained = data.cards;
        this.duplicatedCardIds = data.duplicateCardIds;
        this.refundedAmount = data.refunded;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isOpenPackLoading = false;
      }
    },

    /**
     * Reset the openning pack state
     */
    resetOpenning() {
      this.cardObtained = [];
      this.duplicatedCardIds = [];
      this.refundedAmount = 0;
    },
  },
});
