import { defineStore } from 'pinia';
import $API from '@/plugins/axios';

const createObjectURL = (window.URL || window.webkitURL).createObjectURL || window.createObjectURL;

export const useProfileStore = defineStore('profileStore', {
  state: () => ({
    isProfileLoading: false,
    /**
     * @type {{
     *  id: number;
     *  email: string;
     *  firstname: string;
     *  lastname: string;
     *  avatar: string;
     *  role: string;
     *  balance: number;
     *  createdAt: string;
     *  updatedAt: string;
     * }
     */
    profile: {},
    /**
     * @type {string | null}
     */
    avatarUrl: null,
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

    async getProfileAvatar() {
      try {
        const { data } = await $API.get('/users/me/avatar', { responseType: 'blob' });
        this.avatarUrl = createObjectURL(data);
        return data;
      } catch (err) {
        throw err.response.data;
      }
    },

    async addToBalance(amount) {
      try {
        this.profile.balance += amount;
      } catch (err) {
        throw err.response.data;
      }
    },
  },
});
