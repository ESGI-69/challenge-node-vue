import { defineStore } from 'pinia';

import $API from '@/plugins/axios';

export const useProductStore = defineStore('productStore', {
  state: () => ({
    isProductsLoading: false,
    isProductLoading: false,
    products: [],
  }),

  actions: {
    /**
     * Get all products
     * @returns {Array} The products
     */
    async getProducts() {
      this.isProductsLoading = true;
      try {
        const { data } = await $API.get('/products');
        this.products = data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isProductsLoading = false;
      }
    },

    /**
     * Get a product
     * @param {int} id The product id
     * @returns {Object} The product
     */
    async getProduct(id) {
      this.isProductLoading = true;
      try {
        const { data } = await $API.get(`/products/${id}`);
        return data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isProductLoading = false;
      }
    },
  },
});
