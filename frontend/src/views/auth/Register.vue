<template>
  <form
    class="register"
    @submit.prevent="register"
  >
    <div class="register__input nes-field">
      <label for="firstname">First name</label>
      <input
        id="firstname"
        v-model="firstname"
        class="nes-input"
        type="text"
      >
    </div>
    <div class="register__input nes-field">
      <label for="lastname">Last name</label>
      <input
        id="lastname"
        v-model="lastname"
        class="nes-input"
        type="text"
      >
    </div>
    <div class="register__input nes-field">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="email"
        class="nes-input"
        type="email"
      >
    </div>
    <div class="register__input nes-field">
      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        class="nes-input"
        type="password"
      >
    </div>
    <div class="register__input nes-field">
      <label for="password_confirmation">Password Confirmation</label>
      <input
        id="password_confirmation"
        v-model="password_confirmation"
        class="nes-input"
        type="password"
      >
    </div>
    <div class="register__input">
      <button
        type="submit"
        class="nes-btn is-primary"
        :disabled="!isPasswordMatch"
      >
        Register
      </button>
    </div>
    <span
      v-for="errorMessage in errorMessages"
      :key="errorMessage"
      class="nes-text is-error"
    >
      {{ errorMessage }}
    </span>
  </form>
</template>

<script>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import router from '@/router';

import { isMatch } from 'lodash';

export default {
  name: 'Register',
  setup() {
    const firstname = ref('');
    const lastname = ref('');
    const email = ref('');
    const password = ref('');
    const password_confirmation = ref('');
    const errorMessages = ref([]);

    const isPasswordMatch = computed(() => {
      const isMatch = password.value === password_confirmation.value;
      if (!isMatch) {
        handleErrors([ 'password', 'password_confirmation' ]);
      } else {
        removeFieldsInError();
      }
      return isMatch;
    });

    const userStore = useUserStore();

    /**
     * Add the class to the fields in error to the form
     * @param {string[]} inErrorFileds The ID of the fields in error
     */
    const handleErrors = (inErrorFileds) => {
      inErrorFileds.forEach((field) => {
        const fieldElement = document.getElementById(field);
        fieldElement.classList.add('is-error');
      });

      if (inErrorFileds.includes('password_confirmation') && inErrorFileds.includes('password')) {
        if (!errorMessages.value.includes('Passwords do not match')) {
          errorMessages.value.push('Passwords do not match');
        }
      }

      if (inErrorFileds.includes('password') && !inErrorFileds.includes('password_confirmation')) {
        if (!errorMessages.value.includes('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character')) {
          errorMessages.value.push('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character');
        }
      }

      if (inErrorFileds.includes('email')) {
        if (!errorMessages.value.includes('Email is required/invalid')) {
          errorMessages.value.push('Email is required/invalid');
        }
      }

      if (inErrorFileds.includes('firstname')) {
        if (!errorMessages.value.includes('First name is required')) {
          errorMessages.value.push('First name is required');
        }
      }

      if (inErrorFileds.includes('lastname')) {
        if (!errorMessages.value.includes('Last name is required')) {
          errorMessages.value.push('Last name is required');
        }
      }
    };

    const removeFieldsInError = () => {
      const fields = document.querySelectorAll('.is-error');
      fields.forEach((field) => {
        field.classList.remove('is-error');
      });
      errorMessages.value = [];
    };

    const register = async () => {
      try {
        if (!isPasswordMatch.value) {
          console.log('passwords do not match');
          return;
        }
        removeFieldsInError();
        await userStore.register({
          firstname: firstname.value,
          lastname: lastname.value,
          email: email.value,
          password: password.value,
        });
        console.log('registered');
        router.push({ name: 'login' });
      } catch (err) {
        const fieldsInError = Object.keys(err).map(type => err[type]).flat();
        handleErrors(fieldsInError);
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
      errorMessages,
    };
  },
};
</script>

<style lang="scss" scoped>
.register {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__input {
    display: flex;
    flex-direction: column;
  }
}
</style>
