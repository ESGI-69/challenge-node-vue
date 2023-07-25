import { defineStore } from 'pinia';

import $API from '@/plugins/axios';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    isRegisterLoading: false,
    isUpdateLoading: false,
    isEmailUpdated: false,
    isPasswordUpdated: false,
    isUsersLoading: false,
    isUserUpdateLoading: false,
    users: [],
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

    /**
     * Get All users
     * @returns {Array} The users
     */
    async getUsers() {
      try {
        const { data } = await $API.get('/users/');
        this.users = data;
      } catch (err) {
        throw err.response.data;
      }
    },

    /**
     * Update a user
     * @param {{ email: string, password: string, firstname: string, lastname: string, avatar: File, update_password: string, update_password_confirmation: string }} payload The payload sent to the API
     */
    async updateUser(payload) {
      this.isUserUpdateLoading = true;
      try {
        const { data } = await $API.patch(`/users/${payload.id}/`, payload);
        const index = this.users.findIndex((user) => user.id === data.id);
        this.users[index] = data;
        // return data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isUserUpdateLoading = false;
      }
    },

    /**
     * Ban a user
     * @param {number} id The user id
     */
    async banUser(payload) {
      try {
        const { data } = await $API.patch(`/users/${payload.id}/ban/`, payload);
        const index = this.users.findIndex((user) => user.id === data.id);
        this.users[index] = data;
      } catch (err) {
        throw err.response.data;
      }
    },
  },
});
