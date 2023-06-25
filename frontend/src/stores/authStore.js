import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

import $API from '@/plugins/axios';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: null,
    isLoginLoading: false,
    isConfirmEmailLoading: false,
  }),

  actions: {
    async login(email, password) {
      this.isLoginLoading = true;
      try {
        const { data } = await $API.post('/login/', {
          email,
          password,
        });
        this.token = data.token;
        Cookies.set(import.meta.env.VITE_COOKIE_TOKEN_NAME, this.token);
      } finally {
        this.isLoginLoading = false;
      }
    },

    /**
     * Lougout the user. Remove the token from the store and the cookie
     */
    async logout() {
      this.isLogged = false;
      try {
        Cookies.remove(import.meta.env.VITE_COOKIE_TOKEN_NAME);
      } catch (error) {
        Cookies.remove(import.meta.env.VITE_COOKIE_TOKEN_NAME);
        throw error;
      }
    },

    /**
     * Confirm user email
     */
    async confirmEmail(mailToken) {
      this.isConfirmEmailLoading = true;
      try {
        await $API.post('/users/confirm-email/', {
          mailToken,
        });
      } finally {
        this.isConfirmEmailLoading = false;
      }
    },

    /**
     * Init tha auth store by retiving the JWT and put it in the state
     */
    init() {
      const token = Cookies.get(import.meta.env.VITE_COOKIE_TOKEN_NAME);
      if (token) {
        this.token = token;
      }
    },
  },
});

