<template>
  <form
    class="login"
    @submit.prevent="login"
  >
    <div class="login__input nes-field">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="email"
        class="nes-input"
        type="email"
        placeholder="Email"
        required
      >
    </div>
    <div class="login__input">
      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        class="nes-input"
        type="password"
        placeholder="Password"
        required
      >
    </div>
    <div class="login__input">
      <button
        type="submit"
        class="nes-btn is-primary"
      >
        Login
      </button>
    </div>
    <span
      v-if="error"
      class="nes-text is-error"
    >
      Invalid credentials
    </span>
  </form>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'Login',
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref(false);
    const authStore = useAuthStore();
    const router = useRouter();

    const login = async () => {
      try {
        error.value = false;
        await authStore.login(email.value, password.value);
      } catch {
        console.log('error');
        error.value = true;
      }
    };

    if (authStore.token) {
      router.push({ name: 'home' });
    }

    return {
      email,
      password,
      login,
      error,
    };
  },
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__input {
    display: flex;
    flex-direction: column;
  }
}
</style>
