<template>
  <div class="chat">
    <div
      v-if="isChatOpen"
      class="chat__container nes-container"
    >
      <div class="chat__container__messages">
        <p
          v-for="message in messages"
          :key="message.id"
        >
          <span class="chat__container__messages__date">
            {{ formatDateChat(message.createdAt) }}
          </span>
          <span class="chat__container__messages__name">
            {{ message.user.firstname }}:
          </span>
          <span>
            {{ message.content }}
          </span>
        </p>
      </div>
      <textarea
        id="textarea_field"
        class="nes-textarea"
        placeholder="Type your message"
      />
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
import { useChatStore } from '@/stores/chatStore';
import formatDateChat from '@/utils/formatDateChat';

export default {
  name: 'ChatGlobal',
  components: {
  },
  setup() {
    const isChatOpen = ref(false);
    const chatStore = useChatStore();
    const messages = computed(() => chatStore.chatMessages);
    chatStore.getChatMessages();


    return {
      mail,
      isChatOpen,
      messages,
      formatDateChat,
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
    &__messages {
      overflow: scroll;
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
