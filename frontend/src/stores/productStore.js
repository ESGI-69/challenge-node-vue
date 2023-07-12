import { defineStore } from "pinia";

import $API from "@/plugins/axios";

export const useProductStore = defineStore("productStore", {
  state: () => ({
    isProductsLoading: false,
    products: [],
  }),

  actions: {
    async getProducts() {
      this.isProductsLoading = true;
      try {
        const { data } = await $API.get("/products");
        this.products = data;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isProductsLoading = false;
      }
    }
  }
});