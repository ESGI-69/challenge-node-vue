<template>
  <form
    class="login"
    @submit.prevent="login"
  >
    <div class="login__input">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="email"
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
        type="password"
        placeholder="Password"
        required
      >
    </div>
    <div class="login__input">
      <button
        type="submit"
        class="btn btn--primary"
      >
        Login
      </button>

      <div
        v-if="error"
        class="login__error"
      >
        Invalid credentials
      </div>
    </div>
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
  &__input {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    label {
      margin-bottom: 5px;
    }

    input {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  }

  &__error {
    color: red;
    margin-top: 10px;
  }
}
</style>
