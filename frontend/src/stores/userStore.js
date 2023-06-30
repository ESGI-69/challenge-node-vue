import { defineStore } from 'pinia';

import $API from '@/plugins/axios';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    isRegisterLoading: false,
    isUpdateLoading: false,
    isEmailUpdated: false,
    isPasswordUpdated: false,
  }),

  actions: {
    /**
     * Register a new user
     * @param {{ email: string, password: string, firstname: string, lastname: string, avatar: File }} payload The payload sent to the API
     */
    async register(payload) {
      this.isRegisterLoading = true;
      try {
        await $API.post('/users/', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isRegisterLoading = false;
      }
    },

    /**
     * Update current user
     * @param {{ email: string, password: string, firstname: string, lastname: string, avatar: File, update_password: string, update_password_confirmation: string }} payload The payload sent to the API
     */
    async update(payload) {
      this.isUpdateLoading = true;
      try {
        const user = await $API.patch('/users/me/', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        this.isEmailUpdated = user.data.isEmailUpdated;
        this.isPasswordUpdated = user.data.isPasswordUpdated;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isUpdateLoading = false;
      }
    },
  },
});
