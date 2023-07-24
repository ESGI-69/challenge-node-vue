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
     *  first_player_hp: number;
     *  second_player_hp: number;
     *  winner: number;
     *  createdAt: string;
     *  updatedAt: string;
     *  startedAt: string;
     *  endedAt: string;
     *  current_player: number;
     *  turnStartedAt: string;
     *  first_player_mana: number;
     *  second_player_mana: number;
     *  turn_count: number;
     * }}
     */
    game: {},
  }),

  getters: {
    iAmGameOwner: (state) => state.game.first_player === useProfileStore().profile.id,
    playerMana: (state) => (state.game.first_player === useProfileStore().profile.id ? state.game.first_player_mana : state.game.second_player_mana),
    opponentMana: (state) => (state.game.first_player === useProfileStore().profile.id ? state.game.second_player_mana : state.game.first_player_mana),
  },

  actions: {
    /**
     * Get the game by ID
     * @param {string} id 6 character long game ID
     */
    async getGame(id) {
      this.isGameLoading = true;
      try {
        const { data } = await $API.get(`/game/${id.toLowerCase()}`);
        this.setGame(data);
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
      game.id = game.id.toUpperCase();
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

    /**
     * Start the current game
     */
    async start() {
      try {
        await $API.post('/game/start');
      } catch (error) {
        throw error.response;
      }
    },

    async endTurn() {
      try {
        await $API.post('/game/end-turn');
      } catch (error) {
        throw error.response;
      }
    },
  },
});
