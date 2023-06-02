import { defineStore } from 'pinia';

import $API from '@/plugins/axios';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    isRegisterLoading: false,
  }),

  actions: {
    /**
     * Register a new user
     * @param {{ email: string, password: string, firstname: string, lastname: string }} payload The payload sent to the API
     */
    async register(payload) {
      this.isRegisterLoading = true;
      try {
        await $API.post('/users/', payload);
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isRegisterLoading = false;
      }
    },
  },
});
