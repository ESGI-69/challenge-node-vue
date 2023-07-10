import { defineStore } from 'pinia';
import { useProfileStore } from './profileStore';

import $API from '@/plugins/axios';

export const useGameStore = defineStore('gameStore', {
  state: () => ({
    isGameLoading: false,
    isCreateGameLoading: false,
    isGameLeft: false,
    isLeaveGameLoading: false,
    isJoinGameLoading: false,
    /**
     * @type {{
     *  id: string;
     *  firstPlayer: Object;
     *  first_player: number;
     *  secondPlayer: Object;
     *  second_player: number;
     *  winner: number;
     *  createdAt: string;
     *  updatedAt: string;
     *  endAt: string;
     * }}
     */
    game: {},
  }),

  getters: {
    iAmGameOwner: (state) => state.game.first_player === useProfileStore().profile.id,
  },

  actions: {
    /**
     * Get the game by ID
     * @param {string} id 6 character long game ID
     */
    async getGame(id) {
      this.isGameLoading = true;
      try {
        const { data } = await $API.get(`/game/${id}`);
        this.game = data;
      } catch (error) {
        return error.response;
      } finally {
        this.isGameLoading = false;
      }
    },

    /**
     * Create a new game
     */
    async create() {
      this.isCreateGameLoading = true;
      try {
        const { data: { id } } = await $API.post('/game/');
        return id;
      } catch (error) {
        throw error.response;
      } finally {
        this.isCreateGameLoading = false;
      }
    },

    setGame(game) {
      this.game = game;
    },

    /**
     * Join a game via his ID
     * @param {string} id 6 characters long game ID
     */
    async join(id) {
      this.isJoinGameLoading = true;
      try {
        const { data } = await $API.post('/game/join', { id });
        return { id: data.id };
      } catch (error) {
        throw error.response;
      } finally {
        this.isCreateGameLoading = false;
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
      catch (error) {
        throw error.response;
      }
      finally {
        this.game = {};
        this.isCreateGameLoading = false;
        this.isGameLeft = true;
      }
    },

    /**
     * Remove the current game
     */
    async remove() {
      try {
        await $API.delete('/game/');
      } catch (error) {
        throw error.response;
      }
    },
  },
});
