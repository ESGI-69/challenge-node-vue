<template>
  <div
    v-if="isOpen"
    class="checkout"
  >
    <span
      class="checkout__text nes-text"
      :class="`${isSuccess ? 'is-success' : 'is-error'}`"
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
import { useProfileStore } from '@/stores/profileStore';

export default {
  name: 'Checkout',
  async setup()  {
    const isOpen= ref(true);
    const isSuccess = ref(router.currentRoute.value.query.isSuccess === 'true');
    const successText = ref('The payment has been successful, thank you for your purchase!');
    const errorText = ref('The payment has been canceled, we didn\'t deduct any money from your account.');

    const paymentStore = usePaymentStore();
    const profileStore = useProfileStore();

    try {
      await paymentStore.patchPayment(parseInt(router.currentRoute.value.query.id));
      if (isSuccess.value) {
        await profileStore.getProfile();
      }
    } catch (error) {
      router.push('/shop');
    }

    const checkoutText = computed(() => isSuccess.value ? successText.value : errorText.value);

    return {
      isOpen,
      checkoutText,
      isSuccess,
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
  &__button {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
}
</style>
