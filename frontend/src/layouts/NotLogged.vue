<template>
  <div
    class="not-logged"
    :style="{ backgroundImage: `url(${notLoggedBackground})` }"
  >
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
import notLoggedBackground from '@/assets/notLoggedBackground.webp';

export default {
  name: 'LoggedLayout',
  setup() {
    return {
      notLoggedBackground,
    };
  },
};
</script>

<style lang="scss" scoped>
.not-logged {
  &__main {
    box-sizing: border-box;
    height: 100%;
    padding: 24px;
    overflow-y: auto;
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