import { defineStore } from 'pinia';
import $API from '@/plugins/axios';

const createObjectURL = (window.URL || window.webkitURL).createObjectURL || window.createObjectURL;

export const useProfileStore = defineStore('profileStore', {
  state: () => ({
    isProfileLoading: false,
    isGameHistoryLoading: false,
    gameHistory : [],
    /**
     * @type {{
     *  id: number;
     *  email: string;
     *  firstname: string;
     *  lastname: string;
     *  avatar: string;
     *  role: string;
     *  balance: number;
     *  xp: number;
     *  createdAt: string;
     *  updatedAt: string;
     * }
     */
    profile: {},
    /**
     * @type {string | null}
     */
    avatarUrl: null,
  }),

  getters: {
    /**
     * @returns {string}
     **/
    getFullName: (state) => `${state.profile.firstname} ${state.profile.lastname}`,
    getId: (state) => state.profile.id,
    isAdmin: (state) => state.profile.role === 'ADMIN',
  },

  actions: {
    async getProfile() {
      this.isProfileLoading = true;
      try {
        const { data } = await $API.get('/users/me');
        this.setProfile(data);
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isProfileLoading = false;
      }
    },

    async setProfile(data) {
      const avatarUrl = `${import.meta.env.VITE_API}/profile-pictures/${data.avatar}`;
      this.profile = { ...data, avatar: avatarUrl };
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

    async getGameHistory() {
      this.isGameHistoryLoading = true;
      try {
        const { data } = await $API.get('/game/history');
        this.gameHistory = data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isGameHistoryLoading = false;
      }
    },
    async updateDeckFav(idDeck) {
      this.isGameHistoryLoading = true;
      try {
        const { data } = await $API.post(`/users/choose-fav-deck/${idDeck}`);
        this.profile = data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isGameHistoryLoading = false;
      }
    },
  },
});
