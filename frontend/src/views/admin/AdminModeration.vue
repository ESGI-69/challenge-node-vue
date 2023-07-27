<template>
  <div class="admin-moderation">
    <el-table
      v-loading="isGetChatMessagesReportedLoading"
      :data="reportedMessagesFormated"
      height="75vh"
      stripe
      :default-sort="{ prop: 'reportedAt', order: 'descending' }"
    >
      <el-table-column
        prop="id"
        label="ID"
      />
      <el-table-column
        prop="content"
        label="Message"
      />
      <el-table-column
        prop="user.email"
        label="User Email"
      />
      <el-table-column
        prop="user.firstname"
        label="User Firstname"
      />

      <el-table-column
        prop="createdAt"
        label="Created At"
      />
      <el-table-column
        prop="isReportedAt"
        label="Reported At"
        sortable
      />
      <el-table-column
        prop="actions"
        label="Actions"
      >
        <template #default="{ row }">
          <el-button
            type="danger"
            size="small"
            :loading="isDeleteMessageLoading"
            @click="deleteMessage(row)"
          >
            Delete
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="deleteAndBanUser(row)"
          >
            Delete and ban user
          </el-button>
          <el-button
            type="success"
            size="small"
            :loading="isUnreportMessageLoading"
            @click="unreportMessage(row)"
          >
            Unreport
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useChatStore } from '@/stores/chatStore';
import { useUserStore } from '@/stores/userStore';
import formatDate from '@/utils/formatDate';
export default {
  name: 'AdminModeration',
  setup() {
    const chatStore = useChatStore();
    const userStore = useUserStore();

    const isGetChatMessagesReportedLoading = computed(() => chatStore.isGetChatMessagesReportedLoading);
    const isUnreportMessageLoading = computed(() => chatStore.isUnreportMessageLoading);
    const isDeleteMessageLoading = computed(() => chatStore.isDeleteMessageLoading);

    const reportedMessages = computed(() => chatStore.reportedMessages);

    chatStore.getReportedMessages();

    const reportedMessagesFormated = computed(() => reportedMessages.value.map((message) => ({
      ...message,
      createdAt: formatDate(message.createdAt),
      isReportedAt: formatDate(message.isReportedAt),
    })));

    const deleteMessage = async (message) => {
      await chatStore.deleteMessage(message.id);
      chatStore.getReportedMessages();
    };

    const deleteAndBanUser = async (message) => {
      await chatStore.deleteMessage(message.id);
      await userStore.banUser({ id: message.user.id, isBanned: true });
      chatStore.getReportedMessages();
    };

    const unreportMessage = async (message) => {
      await chatStore.unreportMessage(message.id);
      chatStore.getReportedMessages();
    };

    return {
      isGetChatMessagesReportedLoading,
      formatDate,
      reportedMessagesFormated,
      unreportMessage,
      isUnreportMessageLoading,
      deleteMessage,
      isDeleteMessageLoading,
      deleteAndBanUser,
    };
  },
};
</script>
