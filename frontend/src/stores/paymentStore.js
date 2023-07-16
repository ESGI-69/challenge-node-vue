import { defineStore } from 'pinia';

import $API from '@/plugins/axios';

export const usePaymentStore = defineStore('paymentStore', {
  state: () => ({
    isPaymentsLoading: false,
    checkoutUrl: '',
  }),

  actions: {
    /**
     * @param {{ name: string, image: string, quantity: number }} payload The product to pay
     */
    async postPayment(payload) {
      this.isPaymentsLoading = true;
      try {
        const payment = await $API.post('/payments/', payload, { headers: { 'Content-Type': 'multipart/form-data' } } );
        this.checkoutUrl = payment.data.checkoutUrl;
      } catch (err) {
        throw err.response.data;
      } finally {
        this.isPaymentsLoading = false;
      }
    },
  },
});
