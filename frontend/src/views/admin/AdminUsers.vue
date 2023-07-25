<template>
  <p>Users</p>

  <div>
    <el-table
      :row-class-name="tableRowClassName"
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
            @click="handleEdit(scope.row)"
          >
            Edit
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleBan(scope.row)"
          >
            {{ scope.row.isBanned ? 'Unban' : 'Ban' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-drawer
      v-model="showUserDialog"
      title="User edit"
      :with-header="false"
    >
      <el-form
        :model="selectedUser"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="Name">
          <el-input v-model="selectedUser.lastname" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="selectedUser.email" />
        </el-form-item>
        <el-form-item label="Role">
          <el-select v-model="selectedUser.role">
            <el-option
              v-for="role in roles"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Balance">
          <el-input-number v-model="selectedUser.balance" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
          >
            Save
          </el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/userStore';
export default {
  name: 'AdminUsers',
  setup() {

    const userStore = useUserStore();
    userStore.getUsers();


    const tableRowClassName = ({ row }) => {
      if (row.isBanned) {
        return 'warning-row';
      }
    };

    const roles = [
      {
        label: 'Admin',
        value: 'ADMIN',
      },
      {
        label: 'Player',
        value: 'PLAYER',
      },
    ];

    const users = computed(() => userStore.users);
    const selectedUser = reactive({});
    const showUserDialog = ref(false);

    const handleEdit = (user) => {
      selectedUser.id = user.id;
      selectedUser.lastname = user.lastname;
      selectedUser.email = user.email;
      selectedUser.role = user.role;
      selectedUser.balance = user.balance;
      showUserDialog.value = !showUserDialog.value;
    };

    const handleSubmit = async () => {
      try {

        await userStore.updateUser({
          id: selectedUser.id,
          lastname: selectedUser.lastname,
          email: selectedUser.email,
          role: selectedUser.role,
          balance: selectedUser.balance,
        });

        ElMessage({
          message: 'User updated.',
          type: 'success',
        });

        setTimeout(() => {
          showUserDialog.value = !showUserDialog.value;
        }, 1000);

      } catch (error) {
        ElMessage({
          message: 'User not updated.',
          type: 'error',
        });
      }

    };

    const handleBan = async (user) => {
      try {
        await userStore.banUser({
          id: user.id,
          isBanned: !user.isBanned,
        });
        user.isBanned = !user.isBanned;

        let bannedResult = user.isBanned ? 'banned' : 'unbanned';

        ElMessage({
          message: `User ${bannedResult}.`,
          type: 'success',
        });
      } catch (error) {
        ElMessage({
          message: 'Ban not updated.',
          type: 'error',
        });
      }
    };

    return {
      users,
      selectedUser,
      showUserDialog,
      handleEdit,
      roles,
      handleSubmit,
      tableRowClassName,
      handleBan,
    };
  },
};
</script>

<style scoped>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
  </style>

