import { defineStore } from 'pinia';
import $API from '@/plugins/axios';

export const useChatStore = defineStore('chatStore', {
  state: () => ({
    isGetChatMessagesLoading: false,
    chatMessages: [],
  }),

  actions: {
    async getChatMessages() {
      this.isGetChatMessagesLoading = true;
      try {
        const { data } = await $API.get('/chat-messages');
        this.chatMessages = data;
      } catch (err) {
        console.error(err);
      } finally {
        this.isGetChatMessagesLoading = false;
      }
    },
  },
});
