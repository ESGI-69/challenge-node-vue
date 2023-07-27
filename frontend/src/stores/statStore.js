import { defineStore } from 'pinia';

import $API from '@/plugins/axios';

export const useStatStore = defineStore('statStore', {
  state: () => ({
    isCardsCountLoading: false,
    isCardsCountByTypeLoading: false,
    isTotalXpLoading: false,
    isTotalPackOpenLoading: false,
    isNumberOfPackOpenByDayLoading: false,
    cardsCount: 0,
    cardsCountByType: [],
    totalXp: 0,
    totalPackOpen: 0,
    numberOfPackOpenByDay: [],
    numberOfCurrentGames: 0,
    totalCreditsPurchased: 0,
    totalMoneySpent: 0,
    bestSellerProduct: {},
    averageGameDuration: 0,
    bestPlayer: {},
    totalUsers : 0,
  }),

  actions: {
    async getCardsCount() {
      this.isCardsCountLoading = true;
      try {
        const { data } = await $API.get('/stat/cards-count');
        this.cardsCount = data.count;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isCardsCountLoading = false;
      }
    },

    async getCardsCountByType() {
      this.isCardsCountByTypeLoading = true;
      try {
        const { data } = await $API.get('/stat/cards-count-by-type');
        this.cardsCountByType = data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isCardsCountByTypeLoading = false;
      }
    },

    async getTotalXp() {
      this.isTotalXpLoading = true;
      try {
        const { data } = await $API.get('/stat/total-xp');
        this.totalXp = data.xp;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isTotalXpLoading = false;
      }
    },

    async getTotalPackOpen() {
      this.isTotalPackOpenLoading = true;
      try {
        const { data } = await $API.get('/stat/total-pack-open');
        this.totalPackOpen = data.totalOpenedPacks;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isTotalPackOpenLoading = false;
      }
    },

    async getNumberOfPackOpenByDay() {
      this.isNumberOfPackOpenByDayLoading = true;
      try {
        const { data } = await $API.get('/stat/number-of-pack-open-by-day');
        this.numberOfPackOpenByDay = data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isNumberOfPackOpenByDayLoading = false;
      }
    },

    async getTotalNumbersOfCurrentGames() {
      try {
        const { data } = await $API.get('/stat/admin/total-games');
        this.numberOfCurrentGames = data.totalNumbersOfCurrentGames;
      } catch (err) {
        throw err.response.data;
      }
    },

    async getTotalCreditsPurchased() {
      try {
        const { data } = await $API.get('/stat/admin/total-credits-purchased');
        this.totalCreditsPurchased = data.totalCreditsPurchased;
      } catch (err) {
        throw err.response.data;
      }
    },

    async getTotalMoneySpent() {
      try {
        const { data } = await $API.get('/stat/admin/total-money-spent');
        this.totalMoneySpent = data.totalMoneySpent;
      } catch (err) {
        throw err.response.data;
      }
    },

    async getAverageGameDuration() {
      try {
        const { data } = await $API.get('/stat/admin/average-game-duration');
        this.averageGameDuration = data.averageGameDurationValue;
      } catch (err) {
        throw err.response.data;
      }
    },

    async getBestPlayer() {
      try {
        const { data } = await $API.get('/stat/admin/best-player');
        this.bestPlayer = data;
      } catch (err) {
        throw err.response.data;
      }
    },

    async getBestProduct() {
      try {
        const { data } = await $API.get('/stat/admin/best-seller-product');
        this.bestSellerProduct = data;
      } catch (err) {
        throw err.response.data;
      }
    },

    async getTotalUsers() {
      try {
        const { data } = await $API.get('/stat/admin/total-users');
        this.totalUsers = data.totalUsers;
      } catch (err) {
        throw err.response.data;
      }
    },

  },
});
