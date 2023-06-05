import { defineStore } from 'pinia';
import $API from '@/plugins/axios';

export const useProfileStore = defineStore('profileStore', {
  state: () => ({
    isProfileLoading: false,
    profile: {},
    isAdmin: false,
  }),

  actions: {
    async getProfile() {
      this.isProfileLoading = true;
      try {
        const { data } = await $API.get('/users/me');
        this.profile = data;
        this.isAdmin = data.role === 'ADMIN';
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isProfileLoading = false;
      }
    },
  },
});