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
        :class="{ 'is-error': !isEmail || (email === '' && error) }"
        type="text"
        placeholder="Email"
        @keypress="error = false"
      >
    </div>
    <div class="login__input">
      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        class="nes-input"
        :class="{ 'is-error': password === '' && error }"
        type="password"
        placeholder="Password"
        @keypress="error = false"
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
      v-if="error && email !== '' && password !== '' && isEmail"
      class="nes-text is-error"
    >
      Invalid credentials
    </span>
    <span
      v-if="!isEmail"
      class="nes-text is-error"
    >
      Invalid email
    </span>
    <span
      v-if="email === '' && error"
      class="nes-text is-error"
    >
      Email required
    </span>
    <span
      v-if="password === '' && error"
      class="nes-text is-error"
    >
      Password required
    </span>
  </form>
</template>

<script>
import { ref, computed } from 'vue';
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

    const isEmail = computed(() => {
      if (!email.value || email.value === '') return true;
      const re = /\S+@\S+\.\S+/;
      return re.test(email.value);
    });

    const login = async () => {
      try {
        await authStore.login(email.value, password.value);
        error.value = false;
        // force reload
        router.go();
      } catch {
        error.value = true;
      }
    };

    return {
      email,
      password,
      login,
      error,
      isEmail,
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
