<template>
  <div class="admin-cards">
    <el-tabs
      v-model="activeName"
      type="card"
      class="tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="Overview"
        name="overview"
      >
        <admin-cards-table />
      </el-tab-pane>
      <el-tab-pane
        label="Create a a new card"
        name="add"
      >
        <admin-cards-edit />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref } from 'vue';

import AdminCardsTable from '@/components/admin/AdminCardsTable.vue';
import AdminCardsEdit from '@/components/admin/AdminCardsEdit.vue';

export default {
  name: 'AdminCards',
  components: {
    AdminCardsTable,
    AdminCardsEdit,
  },
  setup() {
    const activeName = ref('overview');

    const handleClick = (tab) => tab;

    return {
      activeName,
      handleClick,
    };
  },
};
</script>


<style lang="scss" scoped>
.tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
