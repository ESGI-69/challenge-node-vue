<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0">
      LOGO
    </el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="1">
      Processing Center
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        Workspace
      </template>
      <el-menu-item index="2-1">
        item one
      </el-menu-item>
      <el-menu-item index="2-2">
        item two
      </el-menu-item>
      <el-menu-item index="2-3">
        item three
      </el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>
          item four
        </template>
        <el-menu-item index="2-4-1">
          item one
        </el-menu-item>
        <el-menu-item index="2-4-2">
          item two
        </el-menu-item>
        <el-menu-item index="2-4-3">
          item three
        </el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
  </el-menu>
</template>

<script>
import { ref } from 'vue';
import { ElMenu, ElMenuItem } from 'element-plus';

export default {
  name: 'Topbar',
  components: {
    ElMenu,
    ElMenuItem,
  },
  setup() {
    const activeIndex = ref('1');

    // const handleSelect = (index) => {
    //   console.log(index);
    // };

    const handleSelect = (key, keyPath) => {
      console.log(key, keyPath);
    };

    return {
      activeIndex,
      handleSelect,
    };
  },
};
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
