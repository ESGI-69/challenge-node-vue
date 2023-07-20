<template>
  <div class="shop">
    <h1>
      <i class="nes-icon is-large coin" />&nbsp;Shop&nbsp;<i class="nes-icon is-large coin" />
    </h1>
    <h2 v-if="isPaymentLoading">
      Loading...
    </h2>
    <router-view />
    <container>
      <div
        v-if="!isProductsLoading && products.length === 0"
        class="shop__empty"
      >
        <p>
          Shop is empty for now
        </p>
      </div>
      <div
        v-else-if="!isProductsLoading"
        class="shop__items"
      >
        <product
          v-for="product in products.sort((a, b) => a.price - b.price)"
          :key="product.id"
          v-bind="product"
        />
      </div>
      <div
        v-else
        class="shop__loading"
      >
        <p>Loading...</p>
      </div>
    </container>
  </div>
</template>


<script>
import { computed } from 'vue';

import Container from '@/components/Container.vue';
import Product from '@/components/products/Product.vue';

import { useProductStore } from '@/stores/productStore';
import { usePaymentStore } from '@/stores/paymentStore';

export default {
  name: 'Shop',
  components: {
    Container,
    Product,
  },
  async setup() {
    const productStore = useProductStore();
    const paymentStore = usePaymentStore();


    const products = computed(() => productStore.products);
    const isProductsLoading = computed(() => productStore.isProductsLoading);
    const isPaymentLoading = computed(() => paymentStore.isPostPaymentLoading);

    productStore.getProducts();

    return {
      products,
      isProductsLoading,
      isPaymentLoading,
    };
  },
};
</script>

<style lang="scss" scoped>
.shop {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  height: 100%;
  &__loading, &__empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    height: 752px;
    width: 1136px;
  }
  &__items {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}
</style>
