import { defineStore } from 'pinia';

import $API from '@/plugins/axios';

export const useGameStore = defineStore('gameStore', {
  state: () => ({
    isGameLoading: false,
    isGameLeft: false,
    games: {},
  }),

  actions: {
    /**
         * Create a new game
         *
         * @param {{ token: string, first_player: number, second_player: number, winner: number }} payload The payload sent to the API
         */
    async create(payload) {
      this.isGameLoading = true;
      // payload contains the socket id of the player
      try {
        // await $API.post('/game/', payload);
        const { data } = await $API.post('/game/', payload);
        this.games = data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isGameLoading = false;
      }
    },

    async leave(payload) {
      this.isGameLoading = true;
      let gameId = payload.id;
      try {
        // await $API.post('/game/', payload);
        await $API.post('/game/leave/'+gameId, payload);
      }
      catch (err) {
        throw err.response.data;
      }
      finally {
        this.games =  {};
        this.isGameLoading = false;
        this.isGameLeft = true;
      }
    },


  },

});
