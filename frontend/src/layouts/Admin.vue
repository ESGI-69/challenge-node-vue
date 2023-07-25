<template>
  <div class="common-layout">
    <topbar />
    <el-container class="admin-panel is-vertical">
      <slot />
      <footerbar />
    </el-container>
  </div>
</template>

<script>
import Topbar from '@/components/admin/Topbar.vue';
import Footerbar from '@/components/admin/Footerbar.vue';
export default {
  name: 'AdminLayout',
  components: {
    Topbar,
    Footerbar,
  },
  setup() {
    return {};
  },
};
</script>
