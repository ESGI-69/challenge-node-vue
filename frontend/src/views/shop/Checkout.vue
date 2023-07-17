<template>
  <div
    v-if="isOpen"
    class="checkout"
  >
    <span
      class="checkout__text is-error"
    >
      {{ checkoutText }}
    </span>
    <button
      type="button"
      class="checkout__button nes-btn is-error"
      @click="isOpen = false"
    >
      X
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import router from '@/router';

import { usePaymentStore } from '@/stores/paymentStore';

export default {
  name: 'Checkout',
  async setup()  {
    const isOpen= ref(true);

    const paymentStore = usePaymentStore();

    try {
      await paymentStore.patchPayment({
        id: router.currentRoute.value.query.id,
      });
    } catch (error) {
      router.push('/shop');
    }

    const checkoutText = computed(() => {
      const isSuccess = router.currentRoute.value.query.isSuccess === 'true';
      return isSuccess ? 'The payment has been successful, thank you for your purchase!' : 'The payment has been canceled, we didn\'t deduct any money from your account.';
    });

    return {
      isOpen,
      checkoutText,
    };
  },
};
</script>

<style lang="scss" scoped>
.checkout {
  width: 100%;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 0.5em #212529, 0 -0.5em #212529, 0.5em 0 #212529, -0.5em 0 #212529;
  margin: 1rem 0;
  min-height: 2rem;
  padding: 2rem 6rem;
  position: relative;

  &__text {
  }

  &__button {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
}
</style>
