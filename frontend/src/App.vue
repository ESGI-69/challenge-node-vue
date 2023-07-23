<template>
  <div
    class="app"
    :class="{
      'app-admin': $route.meta.layout === 'admin',
    }"
  >
    <router-view
      v-slot="{ Component }"
    >
      <transition
        name="layout"
        mode="out-in"
      >
        <suspense>
          <template #fallback>
            <component
              :is="LoadingComponent"
            />
          </template>
          <component
            :is="LayoutComponent"
          >
            <component :is="Component" />
          </component>
        </suspense>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { computed } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { useAuthStore } from './stores/authStore';

import Loading from './views/Loading.vue';
import LoadingAdmin from './views/LoadingAdmin.vue';
import LoggedLayout from '@/layouts/Logged.vue';
import NotLoggedLayout from '@/layouts/NotLogged.vue';
import AdminLayout from '@/layouts/Admin.vue';

export default {
  name: 'App',
  components: {
    RouterLink,
    RouterView,
    Loading,
  },
  setup() {
    const route = useRoute();
    const authStore = useAuthStore();

    const LayoutComponent = computed(() => {
      if (authStore.token) {
        if (route.meta.layout === 'admin') {
          return AdminLayout;
        }
        return LoggedLayout;
      }
      return NotLoggedLayout;
    });

    const LoadingComponent = computed(() => {
      if (route.meta.layout === 'admin') {
        return LoadingAdmin;
      }
      return Loading;
    });

    return {
      LayoutComponent,
      LoadingComponent,
    };
  },
};
</script>

<style lang="scss" scoped>
.app {
  display: grid;
  height: 100%;
}

/* Layout transition */
.layout-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.layout-enter-active {
  transition: opacity 0.3s, transform 0.3s;
}

.layout-enter-to {
  opacity: 1;
  transform: scale(1);
}

.layout-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.layout-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
