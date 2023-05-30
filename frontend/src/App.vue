<template>
  <router-view
    v-slot="{ Component }"
  >
    <transition-group
      name="fade"
      tag="div"
      class="app"
    >
      <component
        :is="LayoutComponent"
        v-if="!isAppLoading"
      >
        <component :is="Component" />
      </component>
      <!-- <loading-screen v-else /> -->
      <div
        v-else
        class="loading-screen"
      >
        <h1>LOADING</h1>
      </div>
    </transition-group>
  </router-view>
</template>

<script>
import Cookies from 'js-cookie';
import { computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import LoggedLayout from '@/layouts/Logged.vue';
import NotLoggedLayout from '@/layouts/NotLogged.vue';

export default {
  name: 'App',
  components: {
    RouterLink,
    RouterView,
  },
  setup() {
    const authStore = useAuthStore();
    const isAppLoading = computed(() => {
      if (!Cookies.get(import.meta.env.VITE_COOKIE_TOKEN_NAME)) {
        return false;
      } else if (authStore.isLoginLoading) {
        return true;
      }
      return false;
    });

    const LayoutComponent = computed(() => {
      if (authStore.token) {
        return LoggedLayout;
      }
      return NotLoggedLayout;
    });

    return {
      LayoutComponent,
      isAppLoading,
    };
  },
};
</script>

<style scoped>
.app {
  display: grid;
  height: 100%;
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
