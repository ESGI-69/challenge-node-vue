<template>
  <div class="confirm">
    <p v-if="isLoading">
      Please wait confirming email...
    </p>
    <p v-else-if="tokenError">
      Invalid link
    </p>
    <div
      v-else
      class="confirm__content"
    >
      <p>
        Email confirmed
      </p>
      <router-link
        :to="{ name: 'login' }"
        class="nes-btn is-primary"
      >
        Go to login page
      </router-link>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';

import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'Confirm',
  setup() {
    const route = useRoute();
    const authStore = useAuthStore();
    const tokenError = ref(false);

    const isLoading = computed(() => authStore.isConfirmEmailLoading);

    const confirm = async () => {
      try {
        if (!route.query.token || route.query.token === '' ) throw new Error('No token');
        await authStore.confirmEmail(route.query.token);
      } catch (e) {
        tokenError.value = true;
      }
    };

    confirm();

    return {
      confirm,
      isLoading,
      tokenError,
    };
  },
};
</script>

<style lang="scss" scoped>
.confirm {
  text-align: center;
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
