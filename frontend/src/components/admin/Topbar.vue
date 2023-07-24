<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0">
      <router-link
        class="topbar-link"
        to="/"
      >
        <el-icon><back /></el-icon>
        Back
      </router-link>
    </el-menu-item>
    <el-menu-item index="1">
      <router-link
        class="topbar-link"
        :to="{ name : 'adminHome'}"
      >
        Admin Panel
      </router-link>
    </el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="2">
      <router-link
        class="topbar-link"
        :to="{ name: 'adminPayments' }"
      >
        Payments
      </router-link>
    </el-menu-item>
    <el-menu-item index="3">
      <router-link :to="{ name: 'adminUsers' }">
        Users
      </router-link>
    </el-menu-item>
    <el-menu-item>
      Moderation
    </el-menu-item>
  </el-menu>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMenu, ElMenuItem } from 'element-plus';


export default {
  name: 'Topbar',
  components: {
    ElMenu,
    ElMenuItem,
  },
  setup() {
    const router = useRouter();
    const activeIndex =  computed(() => {
      switch (router.currentRoute.value.name) {
        case 'adminHome':
          return '1';
        case 'adminPayments':
          return '2';
        default:
          return '1';
      }
    });

    const handleSelect = (key, keyPath) => `${ key } & ${ keyPath }`;

    return {
      activeIndex,
      handleSelect,
    };
  },
};
</script>

<style lang="scss" scoped>
.flex-grow {
  flex-grow: 1;
}
.topbar-link {
  text-decoration: none;
}
</style>
