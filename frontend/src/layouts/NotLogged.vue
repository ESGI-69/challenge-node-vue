<template>
  <div class="not-logged">
    <!-- <div
      class="not-logged__logo"
      :class="{ 'not-logged__logo--login': $route.name === 'login' }"
    >
      <img
        :src="logo"
        alt="jaji logo"
        class="not-logged__logo__image"
      >
    </div> -->
    <transition-group
      name="fade"
      tag="main"
      class="not-logged__main"
    >
      <slot />
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'LoggedLayout',
  components: {
  },
};
</script>

<style lang="scss" scoped>
.not-logged {
  display: grid;
  grid-template-areas: "logo" "main";
  grid-template-rows: auto 1fr;

  &__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 0;
    transition: all 0.3s ease-in-out;

    &--login {
      padding: 48px 0;
    }

    &__image {
      height: 75px;
    }
  }

  &__main {
    padding: 24px;
    overflow-y: auto;

    @media (max-width: 768px) {
      padding: 24px 16px;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
}
</style>