<template>
  <div class="user-info">
    <img
      class="user-info__avatar"
      :src="avatarUrl"
      :alt="username"
    >
    <div class="user-info__username">
      {{ "username".slice(0, 30) }}
    </div>
    <div class="user-info__balance">
      <span class="nes-text is-primary">
        {{ balance }}
      </span>
      <i class="nes-icon coin is-small" />
    </div>
    <span class="user-info__experience">
      {{ xp }} XP
    </span>
    <div class="user-info__connection-state">
      <div
        class="user-info__connection-state__status-circle"
        :class="{ 'user-info__connection-state__status-circle--connected': isConnected }"
      />
      <span
        v-if="!isConnected"
        class="user-info__connection-state__status-text"
      >disconnected</span>
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
    const xp = computed(() => profileStore.profile.xp);

    return {
      isConnected,
      username,
      balance,
      avatarUrl,
      xp,
    };
  },
};
</script>

<style lang="scss" scoped>
.user-info {
  position: relative;
  display: grid;
  grid-template-areas: "avatar username balance" "avatar user-experience connection-state";
  grid-template-columns: 1fr 3fr;
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
    width: 75px;
    align-self: center;
  }

  &__username {
    grid-area: username;
    align-self: top;
    font-size: 12px;
    word-break: break-word;
  }

  &__balance {
    align-self: top;
    grid-area: balance;
    justify-self: end;
  }

  &__experience {
    grid-area: user-experience;
    align-self: end;
    font-size: 0.75rem;
  }

  &__connection-state {
    align-self: end;
    justify-self: end;
    align-items: end;
    grid-area: connection-state;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    font-size: 0.60rem;

    &__status-circle {
      display: inline-block;
      width: 0.60rem;
      height: 0.60rem;
      border-radius: 50%;
      background-color: red;

      &--connected {
        background-color: green;
      }
    }
  }
}
</style>
