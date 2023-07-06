import { defineStore } from 'pinia';

import $API from '@/plugins/axios';

export const useGameStore = defineStore('gameStore', {
  state: () => ({
    isGameLoading: false,
    isGameLeft: false,
    isLeaveGameLoading: false,
    /**
     * @type {{
     *  id: string;
     *  first_player: number;
     *  second_player: number;
     *  winner: number;
     *  createdAt: string;
     *  updatedAt: string;
     *  endAt: string;
     * }}
     */
    games: {},
  }),

  actions: {
    /**
     * Create a new game
     */
    async create() {
      this.isGameLoading = true;
      try {
        const { data } = await $API.post('/game/');
        this.games = data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isGameLoading = false;
      }
    },

    /**
     * Leave the current game
     */
    async leave() {
      this.isLeaveGameLoading = true;
      try {
        await $API.post('/game/leave');
      }
      catch (err) {
        throw err.response.data;
      }
      finally {
        this.games = {};
        this.isGameLoading = false;
        this.isGameLeft = true;
      }
    },
  },
});
