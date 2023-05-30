<template>
  <div class="login">
    <div class="login__container">
      <div class="login__logo">
        <img
          src="/img/logo.png"
          alt="logo"
        >
      </div>
      <div class="login__form">
        <form @submit.prevent="login">
          <div class="login__form__input">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Email"
              required
            >
          </div>
          <div class="login__form__input">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Password"
              required
            >
          </div>
          <div class="login__form__input">
            <button
              type="submit"
              class="btn btn--primary"
            >
              Login
            </button>

            <div
              v-if="error"
              class="login__form__error"
            >
              Invalid credentials
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
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
        console.log('Logged in');
        // router.push({ name: 'home' });
      } catch {
        console.log('error');
        error.value = true;
      }
    };

    console.log('login');
    console.log(authStore);
    if (authStore.token) {
      console.log('token found');
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