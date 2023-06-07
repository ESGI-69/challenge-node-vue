import { defineStore } from 'pinia';
import $API from '@/plugins/axios';

export const useProfileStore = defineStore('profileStore', {
  state: () => ({
    isProfileLoading: false,
    /**
     * @type {{ id: number, email: string, firstname: string, lastname: string, avatar: string, role: string, createdAt: string, updatedAt: string }
     */
    profile: {},
    isAdmin: false,
  }),

  actions: {
    async getProfile() {
      this.isProfileLoading = true;
      try {
        const { data } = await $API.get('/users/me');
        const avatarUrl = `${import.meta.env.VITE_API}/profile-pictures/${data.avatar}`;
        this.profile = { ...data, avatar: avatarUrl };
        this.isAdmin = data.role === 'ADMIN';
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isProfileLoading = false;
      }
    },
  },
});
