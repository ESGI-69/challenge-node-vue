<template>
  <topbar />
  <router-view />
</template>

<script>
import Topbar from '@/components/admin/Topbar.vue';


export default {
  name: 'AdminView',
  components: {
    Topbar,
  },
  setup() {
    return {};
  },
};
</script>
