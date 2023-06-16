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
  },
});
