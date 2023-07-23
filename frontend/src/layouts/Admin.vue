<template>
  <div class="common-layout">
    <topbar />
    <el-container class="admin-panel is-vertical">
      <slot />
    </el-container>
  </div>
</template>

<script>
import Topbar from '@/components/admin/Topbar.vue';

export default {
  name: 'AdminLayout',
  components: {
    Topbar,
  },
  setup() {
    return {};
  },
};
</script>
