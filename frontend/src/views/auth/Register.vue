<template>
  <form
    class="register"
    @submit.prevent="register"
  >
    <div class="register__input">
      <label for="name">First name</label>
      <input
        id="name"
        v-model="firstname"
        type="text"
        required
      >
    </div>
    <div class="register__input">
      <label for="last_name">Last name</label>
      <input
        id="last_name"
        v-model="lastname"
        type="text"
        required
      >
    </div>
    <div class="register__input">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
      >
    </div>
    <div class="register__input">
      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        required
      >
    </div>
    <div class="register__input">
      <label for="password_confirmation">Password Confirmation</label>
      <input
        id="password_confirmation"
        v-model="password_confirmation"
        type="password"
        required
      >
    </div>
    <div class="register__input">
      <button
        type="submit"
        class="btn btn--primary"
        :disabled="!isPasswordMatch"
      >
        Register
      </button>
      <span v-if="!isPasswordMatch">
        {{ 'Passwords do not match !' }}
      </span>
    </div>
  </form>
</template>

<script>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import router from '@/router';

export default {
  name: 'Register',
  setup() {
    const firstname = ref('');
    const lastname = ref('');
    const email = ref('');
    const password = ref('');
    const password_confirmation = ref('');
    const isPasswordMatch = computed(() => password.value === password_confirmation.value);

    const userStore = useUserStore();

    const register = async () => {
      try {
        if (!isPasswordMatch.value) {
          console.log('passwords do not match');
          return;
        }
        await userStore.register({
          firstname: firstname.value,
          lastname: lastname.value,
          email: email.value,
          password: password.value,
        });
        router.push({ name: 'login' });
      } catch {
        console.log('error');
      }
    };

    return {
      firstname,
      lastname,
      email,
      password,
      password_confirmation,
      register,
      isPasswordMatch,
    };
  },
};
</script>

<style lang="scss" scoped>
.register {
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
