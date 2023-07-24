import { defineStore } from 'pinia';

import $API from '@/plugins/axios';

export const usePaymentStore = defineStore('paymentStore', {
  state: () => ({
    isGetPaymentsLoading: false,
    isPostPaymentLoading: false,
    isPatchPaymentLoading: false,
    isGetPaymentsAdminLoading: false,
    checkoutUrl: '',
    payments: [],
    paymentsAdmin: [],
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

    /**
     *
     * @param {int} id The payment id
     */
    async patchPayment(id) {
      this.isPatchPaymentLoading = true;
      try {
        await $API.patch(`/payments/${id}/`);
      }
      catch (err) {
        throw err.response.data;
      }
      finally {
        this.isPatchPaymentLoading = false;
      }
    },

    /**
     * Get all payments
     * @returns {Array} The payments
     */
    async getPayments(){
      this.isGetPaymentsLoading = true;
      try {
        const { data } = await $API.get('/payments/');
        this.payments = data;
      }
      catch (err) {
        throw err.response.data;
      }
      finally {
        this.isGetPaymentsLoading = false;
      }
    },

    /**
     * Get All payments as Admin
     * @returns {Array} The payments
     */
    async getPaymentsAdmin(){
      this.isGetPaymentsAdminLoading = true;
      try {
        const { data } = await $API.get('/payments/admin/');
        this.paymentsAdmin = data;
      }
      catch (err) {
        throw err.response.data;
      }
      finally {
        this.isGetPaymentsAdminLoading = false;
      }
    },
  },
});
