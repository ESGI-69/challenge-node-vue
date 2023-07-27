import { defineStore } from 'pinia';
import $API from '@/plugins/axios';

export const useChatStore = defineStore('chatStore', {
  state: () => ({
    isGetChatMessagesLoading: false,
    isSendMessageLoading: false,
    isGetChatMessagesReportedLoading: false,
    isUnreportMessageLoading: false,
    chatMessages: [],
    reportedMessages: [],
    isDeleteMessageLoading: false,
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

    async reportMessage(message){
      try {
        await $API.patch(`/chat-messages/report/${message.id}`);
      } catch (err) {
        console.error(err);
      }
    },

    async getReportedMessages() {
      this.isGetChatMessagesReportedLoading = true;
      try {
        const { data } = await $API.get('/chat-messages/report');
        this.reportedMessages = data;
      } catch (err) {
        console.error(err);
      } finally {
        this.isGetChatMessagesReportedLoading = false;
      }
    },

    async deleteMessage(messageId){
      this.isDeleteMessageLoading = true;
      try {
        await $API.delete(`/chat-messages/${messageId}`);
      } catch (err) {
        console.error(err);
      } finally {
        this.isDeleteMessageLoading = false;
      }
    },

    async unreportMessage(messageId){
      this.isUnreportMessageLoading = true;
      try {
        await $API.patch(`/chat-messages/unreport/${messageId}`);
      } catch (err) {
        console.error(err);
      } finally {
        this.isUnreportMessageLoading = false;
      }
    },

    addMessage(message) {
      this.chatMessages.push(message);
    },

    removeMessage(messageId) {
      console.log(messageId);
      const messageIndex = this.chatMessages.findIndex((message) => message.id === messageId);
      this.chatMessages.splice(messageIndex, 1);
    },


  },
});
