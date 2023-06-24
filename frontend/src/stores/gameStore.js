import { defineStore } from 'pinia';

import $API from '@/plugins/axios';

export const useGameStore = defineStore('gameStore', {
    state: () => ({
        isGameLoading: false,
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
            try {
                // await $API.post('/game/', payload);
                const { data } = await $API.post('/game/', payload);
                this.games = data;
            } catch (err) {
                throw err.response.data;
            } finally {
                this.isGameLoading = false;
            }
        }

    },
    
});
        