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

<style lang="scss" scoped>
.auth {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  height: 100%;

  .auth__card {
    width: 300px;
    background-color: #2f003f;
    border-radius: 2rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    .auth__card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      border-bottom: 1px solid #eee;
      a {
        text-decoration: none;
        font-weight: bold;
        color: #eee;

        &:hover {
          text-decoration: underline;
        }
      }
    }
    .auth__card__body {
      padding: 20px;
    }
  }
}
</style>
