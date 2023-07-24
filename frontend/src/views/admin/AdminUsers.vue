<template>
  <p>Users</p>

  <div>
    <el-table
      :data="users"
      style="width: 100%"
    >
      <el-table-column
        prop="lastname"
        label="Name"
      />
      <el-table-column
        prop="email"
        label="Email"
      />
      <el-table-column
        prop="role"
        label="Role"
        width="180"
      />
      <el-table-column
        prop="createdAt"
        label="Created At"
      />
      <el-table-column
        prop="updatedAt"
        label="Updated At"
      />
      <el-table-column label="Action">
        <template #default="scope">
          <el-button
            type="primary"
            size="mini"
          >
            watch
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleEdit(scope.row)"
          >
            Edit
          </el-button>
          <el-button
            type="danger"
            size="mini"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-drawer
      v-model="showUserDialog"
      title="User edit"
      :with-header="false"
    >
      <el-form :model="selectedUser">
        <el-form-item label="Name">
          <el-input v-model="selectedUser.lastname" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="selectedUser.email" />
        </el-form-item>
        <el-form-item label="Role">
          <el-input v-model="selectedUser.role" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">
            Save
          </el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
export default {
  name: 'AdminUsers',
  setup() {

    const userStore = useUserStore();
    userStore.getUsers();

    const users = computed(() => userStore.users);
    const selectedUser = reactive({});
    const showUserDialog = ref(false);

    const handleEdit = (user) => {
      selectedUser.lastname = user.lastname;
      selectedUser.email = user.email;
      selectedUser.role = user.role;
      showUserDialog.value = !showUserDialog.value;
    };

    return {
      users,
      selectedUser,
      showUserDialog,
      handleEdit,
    };
  },
};
</script>

<style scoped>

</style>
