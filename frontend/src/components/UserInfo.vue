<template>
  <div class="user-info">
    <img
      class="user-info__avatar"
      :src="avatarUrl"
      :alt="username"
    >
    <div class="user-info__username">
      {{ username }}
    </div>
    <div class="user-info__balance">
      <span class="nes-text is-primary">
        {{ balance }}
      </span>
      <i class="nes-icon coin is-small" />
    </div>
    <div class="user-info__connection-state">
      <div
        class="user-info__connection-state__status-circle"
        :class="{ 'user-info__connection-state__status-circle--connected': isConnected }"
      />
      <span class="user-info__connection-state__status-text">{{ isConnected ? 'connected' : 'disconnected' }}</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

import { useProfileStore } from '@/stores/profileStore';
import { state } from '@/socket';

export default {
  name: 'UserInfo',
  setup() {
    const profileStore = useProfileStore();

    const isConnected = computed(() => state.connected);
    const username = computed(() => profileStore.profile.firstname);
    const balance = computed(() => profileStore.profile.balance);
    const avatarUrl = computed(() => profileStore.avatarUrl);

    return {
      isConnected,
      username,
      balance,
      avatarUrl,
    };
  },
};
</script>

<style lang="scss" scoped>
.user-info {
  position: relative;
  display: grid;
  grid-template-areas: "avatar username balance";
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 75px;
  column-gap: 0.5rem;
  row-gap: 0.5rem;
  padding: 1rem;
  border: 0.25rem solid black;
  box-sizing: content-box;
  border: {
    top: none;
    right: none;
  };
  background-color: white;

  &__avatar {
    grid-area: avatar;
    height: 100%;
  }

  &__username {
    grid-area: username;
    align-self: center;
  }

  &__balance {
    align-self: center;
    grid-area: balance;
  }

  &__connection-state {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    font-size: 0.60rem;

    &__status-circle {
      display: inline-block;
      width: 0.60rem;
      height: 0.60rem;
      border-radius: 50%;
      background-color: red;
      margin-right: 0.5rem;
      vertical-align: middle;

      &--connected {
        background-color: green;
      }
    }
  }
}
</style>
