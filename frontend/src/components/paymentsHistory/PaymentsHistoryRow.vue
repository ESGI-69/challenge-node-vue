<template>
  <tr>
    <td>{{ id }}</td>
    <td v-if="isPaymentLoading">
      Loading...
    </td>
    <td v-else>
      {{ product.name }}
    </td>
    <td
      class="nes-text"
      :class="{
        'is-success': status === 'PAID',
        'is-warning': status === 'PENDING',
        'is-error': status === 'CANCELED',
      }"
    >
      {{ status }}
    </td>
    <td>{{ formatDate(createdAt) }}</td>
    <td>
      <a
        v-if="status === 'PENDING'"
        class="nes-btn is-primary"
        :href="checkoutUrl"
      >
        Continue checkout
      </a>
      <span v-else>
        No action needed
      </span>
    </td>
  </tr>
</template>

<script>
import { computed, ref } from 'vue';

import formatDate from '@/utils/formatDate.js';

import { useProductStore }  from '@/stores/productStore';

export default {
  name: 'PaymentsHistoryRow',
  props: {
    id: {
      type: Number,
      required: true,
    },
    productId: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
    checkoutUrl: {
      type: String,
      required: true,
    },
  },
  async setup(props) {
    const productStore = useProductStore();
    const product = ref(await productStore.getProduct(props.productId));
    const isPaymentLoading = await computed(() => productStore.isProductLoading);

    return {
      props,
      formatDate,
      isPaymentLoading,
      product,
    };
  },
};
</script>
