<template>
  <div class="topbar">
    <div class="topbar__left">
      <transition
        name="slide-left"
      >
        <button
          v-if="!isHome"
          class="nes-btn topbar__left__menu-button is-primary"
          @click="goToHome"
        >
          &lt; Back to main menu
        </button>
      </transition>
    </div>
    <user-info class="topbar__user-info" />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import UserInfo from './UserInfo.vue';

import logo from '@/assets/logo.png';

export default {
  name: 'Topbar',
  components: {
    UserInfo,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const goToHome = () => {
      router.push({ name: 'home' });
    };

    const isHome = computed(() => route.name === 'home');

    return {
      goToHome,
      isHome,
      logo,
    };
  },
};
</script>

<style lang="scss" scoped>
.topbar {
  display: grid;
  grid-template-areas: "left none user-info";
  grid-template-columns: auto 1fr 300px;

  &__left {
    grid-area: left;
    align-self: end;
    padding-left: 1.5rem;

    &__menu-button {
      font-size: 0.75rem;
    }
  }

  &__user-info {
    grid-area: user-info;
  }
}
</style>
