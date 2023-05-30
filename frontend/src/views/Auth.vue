<template>
  <div class="auth">
    <div class="auth__card">
      <div class="auth__card__header">
        <router-link
          :to="{ name: 'register' }"
        >
          <span>Register</span>
        </router-link>
        <router-link
          :to="{ name: 'login' }"
        >
          <span>Login</span>
        </router-link>
      </div>
      <div class="auth__card__body">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Auth',
};
</script>