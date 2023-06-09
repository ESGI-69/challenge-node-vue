<template>
  <div class="edit-profile">
    <div class="edit-profile__card nes-container">
      <h2 class="title">
        User Settings
      </h2>
      <form
        class="edit-profile__card__user"
        @submit.prevent="updateUser"
      >
        <image-upload
          v-model="avatar"
          :no-file-selected-text="'Upload your avatar'"
          :change-file-selected-text="'Change your avatar'"
          :default-image-url="profileAvatar"
        />
        <div class="edit-profile__double-col">
          <div class="edit-profile__input nes-field">
            <label for="firstname">First name</label>
            <input
              id="firstname"
              v-model="firstname"
              class="nes-input"
              type="text"
            >
          </div>
          <div class="edit-profile__input nes-field">
            <label for="lastname">Last name</label>
            <input
              id="lastname"
              v-model="lastname"
              class="nes-input"
              type="text"
            >
          </div>
        </div>
        <div class="edit-profile__input nes-field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            class="nes-input"
            type="text"
            placeholder="Email"
          >
        </div>
        <div class="edit-profile__input">
          <label for="password">Current Password</label>
          <input
            id="current_password"
            v-model="current_password"
            class="nes-input"
            type="password"
            placeholder="Current Password"
          >
        </div>
        <div class="edit-profile__input">
          <label for="password">Update Password</label>
          <input
            id="password"
            v-model="password"
            class="nes-input"
            type="password"
            placeholder="Update Password"
          >
        </div>
        <div class="edit-profile__input">
          <label for="password_confirmation">Update Password Confirmation</label>
          <input
            id="password_confirmation"
            v-model="password_confirmation"
            class="nes-input"
            type="password"
            placeholder="Update Password Confirmation"
          >
        </div>
        <div class="register__input">
          <button
            type="submit"
            class="nes-btn"
            :class="{
              'is-disabled': !isPasswordMatch,
              'is-primary': isPasswordMatch,
            }"
            :disabled="!isPasswordMatch"
          >
            Update
          </button>
        </div>
        <span
          v-for="errorMessage in errorMessages"
          :key="errorMessage"
          class="nes-text is-error"
        >
          {{ errorMessage }}
        </span>
        <span
          v-if="isUpdated"
          class="nes-text is-success"
        >
          User updated successfully!
        </span>
        <span
          v-if="isPasswordUpdated"
          class="nes-text is-success"
        >
          Password updated you will need to login again!
        </span>
        <span
          v-if="isEmailUpdated"
          class="nes-text is-success"
        >
          Email updated you will need confirm it before login again!
        </span>
      </form>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useProfileStore } from '@/stores/profileStore';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import ImageUpload from './ImageUpload.vue';
import router from '@/router';

export default {
  name: 'EditProfile',
  components: {
    ImageUpload,
  },
  setup() {
    const  profileStore = useProfileStore();
    const userStore = useUserStore();
    const authStore = useAuthStore();

    const profile = computed(() => profileStore.profile);
    const profileAvatar = computed(() => profileStore.avatarUrl);
    const isPasswordUpdated = computed(() => userStore.isPasswordUpdated);
    const isEmailUpdated = computed(() => userStore.isEmailUpdated);

    const firstname = ref(profile.value.firstname);
    const lastname = ref(profile.value.lastname);
    const email = ref(profile.value.email);
    const current_password = ref('');
    const password = ref('');
    const password_confirmation = ref('');
    const isUpdated = ref(false);
    /**
     * @type {File | null}
     */
    const avatar = ref(null);

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

    /**
     * Add the class to the fields in error to the form
     * @param {string[]} inErrorFileds The ID of the fields in error
     */
    const handleErrors = (inErrorFileds) => {
      inErrorFileds.forEach((field) => {
        const fieldElement = document.getElementById(field);
        fieldElement.classList.add('is-error');
      });

      if (inErrorFileds.includes('current_password')) {
        if (!errorMessages.value.includes('Password should match your current password')) {
          errorMessages.value.push('Password should match your current password');
        }
      }

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

    const updateUser = async () =>{
      try {
        if (!isPasswordMatch.value) return;
        removeFieldsInError();
        await userStore.update({
          avatar: avatar.value,
          firstname: firstname.value,
          lastname: lastname.value,
          email: email.value,
          password: current_password.value,
          update_password: password.value,
        });
        isUpdated.value = true;
        if (isEmailUpdated.value || isPasswordUpdated.value) {
          authStore.logout();
          setTimeout(() => {
            router.go();
          }, 5000);
        } else {
          setTimeout(() => {
            router.go();
          }, 2000);
        }
      } catch (err) {
        const fieldsInError = Object.keys(err).map(type => err[type]).flat();
        handleErrors(fieldsInError);
      }
    };

    return {
      firstname,
      lastname,
      email,
      current_password,
      password,
      password_confirmation,
      avatar,
      profileAvatar,
      errorMessages,
      isPasswordMatch,
      updateUser,
      isUpdated,
      isPasswordUpdated,
      isEmailUpdated,
    };
  },
};
</script>

<style lang="scss">
.edit-profile {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  &__card {
    background-color: #fff;
    width: 40vw;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    &__user {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }

  &__double-col {
    display: flex;
    gap: 1rem;
  }

  &__input {
    display: flex;
    flex-direction: column;
  }
}
</style>
