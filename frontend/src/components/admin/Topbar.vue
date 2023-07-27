<template>
  <div class="topbar">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
    >
      <el-menu-item
        index="0"
        class="nav-item"
      >
        <router-link
          class="topbar-link"
          to="/"
        >
          <el-icon><back /></el-icon>
          Back
        </router-link>
      </el-menu-item>
      <el-menu-item
        index="1"
        class="nav-item"
      >
        <router-link
          class="topbar-link"
          :to="{ name : 'adminHome'}"
        >
          Admin Panel
        </router-link>
      </el-menu-item>
      <div class="flex-grow" />
      <el-menu-item
        index="2"
        class="nav-item"
      >
        <router-link
          class="topbar-link"
          :to="{ name: 'adminPayments' }"
        >
          Payments
        </router-link>
      </el-menu-item>
      <el-menu-item
        index="3"
        class="nav-item"
      >
        <router-link
          class="topbar-link"
          :to="{ name: 'adminUsers' }"
        >
          Users
        </router-link>
      </el-menu-item>
      <el-menu-item
        index="4"
        class="nav-item"
      >
        <router-link
          class="topbar-link"
          :to="{ name: 'adminCards' }"
        >
          Cards
        </router-link>
      </el-menu-item>
      <el-menu-item
        index="5"
        class="nav-item"
      >
        <router-link
          class="topbar-link"
          :to="{ name: 'adminModeration' }"
        >
          Moderation
        </router-link>
      </el-menu-item>
    </el-menu>
  </div>
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
        case 'adminUsers':
          return '3';
        case 'adminCards':
          return '4';
        case 'adminModeration':
          return '5';
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

.nav-item {
  padding: 0;
  .topbar-link {
    padding: 0 20px;
  }
}
</style>
