<template>
  <div class="auth">
    <div class="auth__card nes-container with-title">
      <h1 class="title">
        {{ routeName }}
      </h1>
      <div class="auth__card__body">
        <router-view />
        <router-link
          :to="{ name: currentRoute === 'register' ? 'login' : 'register' }"
          class="auth__card__body__link"
        >
          <span v-if="currentRoute === 'register'">You already have an account? Login</span>
          <span v-else>You don't have an account? Register</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'Auth',
  setup() {
    const route = useRoute();

    const routeName = computed(() => route.meta.displayName);
    const currentRoute = computed(() => route.name);

    return {
      routeName,
      currentRoute,
    };
  },
};
</script>

<style lang="scss" scoped>
.auth {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  .auth__card {
    background-color: #fff;
    width: 40vw;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    &__body__link {
      margin-top: 1rem;
      display: block;
      text-align: center;
    }
  }
}

.title {
  font-weight: normal;
}
</style>
