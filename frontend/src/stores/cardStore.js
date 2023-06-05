import { defineStore } from 'pinia';

// import $API from '@/plugins/axios';

export const useCardStore = defineStore('cardStore', {
  state: () => ({
    cards: [],
    card: {},
  }),

  actions: {
    async getCards() {
      // const response = await $API.get('/cards');
      // this.cards = response.data;

      // Fake data await
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Fake data
      this.cards = [
        {
          id: 1,
          name: 'Card 1',
          description: 'Description 1',
          image: 'https://picsum.photos/3000',
        },
        {
          id: 2,
          name: 'Card 2',
          description: 'Description 2',
          image: 'https://picsum.photos/2000',
        },
      ];
    },
  },
});
