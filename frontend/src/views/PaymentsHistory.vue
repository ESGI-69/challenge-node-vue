<template>
  <div class="payments-history">
    <h1>
      Payments History
    </h1>
    <div v-if="!isPaymentsLoading && payments.length === 0">
      <p>Your payment history is empty</p>
    </div>
    <div v-else-if="!isPaymentsLoading">
      <div class="nes-table-responsive">
        <table class="nes-table is-bordered is-centered">
          <thead>
            <tr>
              <th>N°</th>
              <th>Product</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <payment-history-row
              v-for="payment in payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))"
              :key="payment.id"
              v-bind="payment"
              :product="payment.product"
            />
          </tbody>
        </table>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

import PaymentHistoryRow from '@/components/paymentsHistory/PaymentsHistoryRow.vue';

import { usePaymentStore } from '@/stores/paymentStore';

export default {
  name: 'PaymentsHistoryView',
  components: {
    PaymentHistoryRow,
  },
  setup() {
    const paymentStore = usePaymentStore();

    paymentStore.getPayments();

    const isPaymentsLoading = computed(() => paymentStore.isGetPaymentsLoading);
    const payments = computed(() => paymentStore.payments);

    return {
      isPaymentsLoading,
      payments,
    };
  },
};
</script>

<style lang="scss" scoped>
.payments-history {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  height: 100%;
}
</style>
