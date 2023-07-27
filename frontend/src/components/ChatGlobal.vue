<template>
  <div class="chat">
    <div
      v-if="isChatOpen"
      class="chat__container nes-container"
    >
      <div v-if="isGetChatMessagesLoading">
        <p>Loading...</p>
      </div>
      <div
        else
        class="chat__container__messages"
      >
        <p
          v-for="message in messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))"
          :key="message.id"
        >
          <span class="chat__container__messages__date">
            {{ formatDateChat(message.createdAt) }}
          </span>
          <span
            v-if="message.user"
            class="chat__container__messages__name nes-text is-primary"
          >
            {{ message.user.firstname }}:
          </span>
          <span>
            {{ message.content }}
          </span>
        </p>
      </div>
      <div class="chat__container__input">
        <textarea
          id="textarea_field"
          v-model="currentMessage"
          class="nes-textarea"
          placeholder="Type your message"
          maxlength="250"
          @keydown.enter.prevent="sendMessage"
        />
        <button
          class="nes-btn is-primary"
          :class="{
            'is-disabled': !currentMessage || currentMessage === ' ' || isSendMessageLoading,
          }"
          :disabled="!currentMessage || currentMessage === ' ' || isSendMessageLoading "
          @click="sendMessage"
        >
          <img
            :src="send"
            alt="send"
            width="32"
          >
        </button>
      </div>
    </div>
    <div
      class="nes-balloon from-left chat__ballon nes-pointer"
      :class="{
        'is-open': isChatOpen,
      }"
      @click="isChatOpen = !isChatOpen"
    >
      <img
        :src="mail"
        alt="mail-icon"
        width="32"
      >
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import mail from '@/assets/mail.png';
import send from '@/assets/send.png';
import { useChatStore } from '@/stores/chatStore';
import formatDateChat from '@/utils/formatDateChat';
import { socket } from '@/socket';

export default {
  name: 'ChatGlobal',
  components: {
  },
  setup() {
    const isChatOpen = ref(false);
    const currentMessage = ref('');

    const chatStore = useChatStore();

    const isGetChatMessagesLoading = computed(() => chatStore.isGetChatMessagesLoading);
    const isSendMessageLoading = computed(() => chatStore.isSendMessageLoading);

    const messages = computed(() => chatStore.chatMessages);

    chatStore.getChatMessages();

    const sendMessage = async () => {
      await chatStore.sendMessage(currentMessage.value);
      currentMessage.value = '';
    };

    socket.on('chat:message', (message) => {
      chatStore.addMessage(message);
    });

    return {
      mail,
      isChatOpen,
      messages,
      formatDateChat,
      send,
      currentMessage,
      sendMessage,
      isGetChatMessagesLoading,
      isSendMessageLoading,
    };
  },
};
</script>

<style lang="scss" scoped>
.chat {
  z-index: 21;
  &__container{
    position: absolute;
    bottom: 4px;
    right: 22px;
    height: 400px;
    width: 400px;
    background-color: #FFF;
    font-size: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 1rem;
    padding-right: 1rem;
    &__input {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    &__messages {
      overflow: scroll;
      overflow-y: scroll;
      display: flex;
      flex-direction: column-reverse;
      overflow-wrap: break-word;
      &__date {
        font-size: 8px;
        margin-right: 16px;
      }
      &__name {
        font-style: italic;
      }
    }
    .nes-textarea {
      resize: none;
    }
  }
  &__ballon::before {
    left: 12px;
    bottom: -14px;
    width: 20px;
    height: 10px;
  }
  &__ballon {
    padding: 2px;
    position: absolute;
    right: 0;
    bottom: 0;
    margin-bottom: 20px;
  }
  &__ballon::after {
    left: 12px;
    bottom: -12px;
    width: 16px;
    height: 4px;
  }
  .is-open {
    filter: brightness(0.8)
  }
}
</style>
