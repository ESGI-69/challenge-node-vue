import { defineStore } from 'pinia';

export const useAppStore = defineStore('appStore', {
  state: () => ({
    preloadedCardImages: 0,
  }),

  actions: {
    /**
     * Preload card images and resolve the promise when all images are loaded
     * @param {Object[]} cards Array of card images to preload
     */
    async preloadCardImages(cardIds) {
      const promises = [];
      cardIds.forEach((id) => {
        promises.push(new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = `${import.meta.env.VITE_API}/cards/${id}/image`;
        }));
      });

      // When a promise is resolved, increment the preloadedCardImages counter
      promises.forEach((promise) => {
        // Use then() instead of await to avoid blocking the loop
        // eslint-disable-next-line promise/prefer-await-to-then
        promise.then(() => {
          this.preloadedCardImages += 1;
        });
      });

      await Promise.all(promises);
    },
  },
});
