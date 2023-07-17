import { defineStore } from 'pinia';

import $API from '@/plugins/axios';

export const usePaymentStore = defineStore('paymentStore', {
  state: () => ({
    isPostPaymentLoading: false,
    isPatchPaymentLoading: false,
    checkoutUrl: '',
  }),

  actions: {
    /**
     * @param {{ name: string, image: string, quantity: number }} payload The product to pay
     */
    async postPayment(payload) {
      this.isPostPaymentLoading = true;
      try {
        const payment = await $API.post('/payments/', payload, { headers: { 'Content-Type': 'multipart/form-data' } } );
        this.checkoutUrl = payment.data.checkoutUrl;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isPostPaymentLoading = false;
      }
    },

    async patchPayment(payload) {
      this.isPatchPaymentLoading = true;
      try {
        await $API.patch(`/payments/${payload.id}/`, payload);
      }
      catch (err) {
        throw err.response.data;
      }
      finally {
        this.isPatchPaymentLoading = false;
      }
    },
  },
});
