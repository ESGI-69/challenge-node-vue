<template>
  <div
    class="shop-item nes-pointer"
    :class="{ 'is-disabled': isPostPaymentLoading }"
    :disabled="isPostPaymentLoading"
    @click="buyItem"
  >
    <div
      v-if="categorie === 'COINS'"
      class="shop-item__coin"
    >
      <p class="shop-item__coin__value">
        {{ value.toLocaleString() }} <i class="nes-icon coin" />
      </p>
      <p>{{ price }} €</p>
    </div>
    <div v-else>
      <p>{{ name }}</p>
      <p>{{ price }} €</p>
      <p>{{ categorie }}</p>
    </div>
    <img
      v-if="categorie === 'COINS'"
      :src="coinBag"
      alt="coinbag-shop"
      class="shop-item__img-coin"
    >
  </div>
</template>

<script>
import { computed } from 'vue';

import { usePaymentStore } from '@/stores/paymentStore';

import coinBag from '@/assets/coinBag.jpeg';
export default {
  name: 'Product',
  props: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    categorie: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const paymentStore = usePaymentStore();

    const checkoutUrl = computed(() => paymentStore.checkoutUrl);

    const isPostPaymentLoading = computed(() => paymentStore.isPostPaymentLoading);

    const buyItem = async () => {
      await paymentStore.postPayment({
        productId: props.id,
        image: coinBag,
        quantity: 1,
      });
      if (checkoutUrl.value) {
        window.location.href = checkoutUrl.value;
      }
    };
    return {
      props,
      coinBag,
      buyItem,
      isPostPaymentLoading,
    };
  },
};
</script>

<style lang="scss" scoped>
.shop-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 4px solid black;
  padding: 1rem 2rem;
  background-color: #f5f5f5;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  background-color: #fefaee;

  &:hover {
    transform: translateY(-4px);
    transition: transform 0.2s ease-in-out;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
    filter: brightness(90%);
  }

  &__img-coin {
    width: 160px;
    height: auto;
  }

  &__coin {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    &__value {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 20px;
    }
  }
  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
