import { defineStore } from 'pinia';
import $API from '@/plugins/axios';

export const useChatStore = defineStore('chatStore', {
  state: () => ({
    isGetChatMessagesLoading: false,
    isSendMessageLoading: false,
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

    async sendMessage(content) {
      this.isSendMessageLoading = true;
      try {
        await $API.post('/chat-messages', { content });
      } catch (err) {
        console.error(err);
      } finally {
        this.isSendMessageLoading = false;
      }
    },

    addMessage(message) {
      this.chatMessages.push(message);
    },
  },
});
