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
      {{ errorMessage }}
    </span>
    <section v-show="isUserBanned">
      <dialog
        id="dialog-banned"
        class="nes-dialog"
      >
        <form method="dialog">
          <p class="title">
            Banned
          </p>
          <p>Your account is <span class="nes-text is-error">banned.</span></p>


          <section class="nes-container">
            <section class="message -left message-fix">
              <i class="nes-octocat animate from-left" />

              <div class="nes-balloon from-left">
                <p>
                  You've been banned
                </p>
              </div>
            </section>
            <section class="message-list">
              <section class="message -right message-fix">
                <!-- Balloon -->
                <div class="nes-balloon from-right">
                  <p>Why !? I don't undestand ! I didn't try to {{ banReason }}</p>
                </div>
                <i class="nes-bcrikko" />
              </section>
            </section>
          </section>

          <menu class="dialog-menu">
            <button class="nes-btn is-warning">
              I understand
            </button>
          </menu>
        </form>
      </dialog>
    </section>
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
    const errorMessage = ref('');
    const isUserBanned = ref(false);
    const banReason = ref('');
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
        //catch response
      } catch (err) {
        errorMessage.value = err.response.data.message;
        error.value = true;
        if (err.response.data.code === 'user_banned') {
          isUserBanned.value = true;
          banReason.value = err.response.data.reason;
          // Methode pour show la model dans le style de nes.css
          document.getElementById('dialog-banned').showModal();
        }
      }
    };

    return {
      email,
      password,
      login,
      error,
      errorMessage,
      isEmail,
      isUserBanned,
      banReason,
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

.message-fix {
  align-items: center;
  display: flex;
  gap: 1rem;
  padding-bottom: 30px;
}
</style>
