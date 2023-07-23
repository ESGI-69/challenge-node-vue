<template>
  <el-main>
    <h1>{{ title }}</h1>
    <router-view />
  </el-main>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'AdminView',
  setup() {
    const route = useRoute();

    const title = computed(() => {
      if (route.meta.displayName) {
        return route.meta.displayName;
      }
      return 'Admin';
    });

    return {
      title,
    };
  },
};
</script>
