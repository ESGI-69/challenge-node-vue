<template>
  <div class="settings">
    <div class="settings__card nes-container">
      <h2 class="title">
        User Settings
      </h2>
      <form
        class="settings__card__user"
        @submit.prevent="updateUser"
      >
        <image-upload
          v-model="avatar"
          :no-file-selected-text="'Upload your avatar'"
          :change-file-selected-text="'Change your avatar'"
          :default-image-url="profileAvatar"
        />
        <div class="settings__double-col">
          <div class="settings__input nes-field">
            <label for="firstname">First name</label>
            <input
              id="firstname"
              v-model="firstname"
              class="nes-input"
              type="text"
            >
          </div>
          <div class="settings__input nes-field">
            <label for="lastname">Last name</label>
            <input
              id="lastname"
              v-model="lastname"
              class="nes-input"
              type="text"
            >
          </div>
        </div>
        <div class="settings__input nes-field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            class="nes-input"
            type="text"
            placeholder="Email"
          >
        </div>
        <div class="settings__input">
          <label for="password">Current Password</label>
          <input
            id="current_password"
            v-model="current_password"
            class="nes-input"
            type="password"
            placeholder="Current Password"
          >
        </div>
        <div class="settings__input">
          <label for="update_password">Update Password</label>
          <input
            id="update_password"
            v-model="update_password"
            class="nes-input"
            type="password"
            placeholder="Update Password"
          >
        </div>
        <div class="settings__input">
          <label for="update_password_confirmation">Update Password Confirmation</label>
          <input
            id="update_password_confirmation"
            v-model="update_password_confirmation"
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
      </form>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useProfileStore } from '@/stores/profileStore';
import { useUserStore } from '@/stores/userStore';
import ImageUpload from './ImageUpload.vue';

export default {
  name: 'Settings',
  components: {
    ImageUpload,
  },
  setup() {
    const  profileStore = useProfileStore();
    const userStore = useUserStore();

    const profile = computed(() => profileStore.profile);
    const profileAvatar = computed(() => profileStore.avatarUrl);

    const firstname = ref(profile.value.firstname);
    const lastname = ref(profile.value.lastname);
    const email = ref(profile.value.email);
    const current_password = ref('');
    const update_password = ref('');
    const update_password_confirmation = ref('');
    /**
     * @type {File | null}
     */
    const avatar = ref(null);

    const errorMessages = ref([]);

    const isPasswordMatch = computed(() => {
      const isMatch = update_password.value === update_password_confirmation.value;
      if (!isMatch) {
        handleErrors([ 'update_password', 'update_password_confirmation' ]);
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
        console.log('fieldElement', fieldElement);
        fieldElement.classList.add('is-error');
      });

      console.log('inErrorFileds', inErrorFileds);

      if (inErrorFileds.includes('current_password')) {
        if (!errorMessages.value.includes('Password should match your current password')) {
          errorMessages.value.push('Password should match your current password');
        }
      }

      if (inErrorFileds.includes('update_password_confirmation') && inErrorFileds.includes('update_password')) {
        if (!errorMessages.value.includes('Passwords do not match')) {
          errorMessages.value.push('Passwords do not match');
        }
      }

      if (inErrorFileds.includes('update_password') && !inErrorFileds.includes('update_password_confirmation')) {
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

    const updateUser = async () => {
      try {
        if (!isPasswordMatch.value) return;
        console.log('updateUser');
        removeFieldsInError();
        await userStore.update({
          avatar: avatar.value,
          firstname: firstname.value,
          lastname: lastname.value,
          email: email.value,
          password: current_password.value,
        });
      } catch (err) {
        const fieldsInError = Object.keys(err).map(type => err[type]).flat();
        console.log('fieldsInError', fieldsInError);
        handleErrors(fieldsInError);
      }
    };

    return {
      firstname,
      lastname,
      email,
      current_password,
      update_password,
      update_password_confirmation,
      avatar,
      profileAvatar,
      errorMessages,
      isPasswordMatch,
      updateUser,
    };
  },
};
</script>

<style lang="scss">
.settings {
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
