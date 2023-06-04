import { defineStore } from 'pinia';

export const useAppStore = defineStore('appStore', {
  state: () => ({
    preloadedCardImages: 0,
  }),

  actions: {
    /**
     * Preload card images and resolve the promise when all images are loaded
     * @param {string[]} cardImages Array of card images to preload
     */
    async preloadCardImages(cardImages) {
      const promises = [];
      cardImages.forEach((cardImage) => {
        promises.push(new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = cardImage;
        }));
      });

      // When a promise is resolved, increment the preloadedCardImages counter
      promises.forEach((promise) => {
        promise.then(() => {
          this.preloadedCardImages += 1;
        });
      });

      await Promise.all(promises);
    },
  },
});
