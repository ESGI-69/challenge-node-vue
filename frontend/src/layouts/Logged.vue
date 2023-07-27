<template>
  <transition
    name="view"
    mode="out-in"
  >
    <div
      v-if="!isLoading"
      class="logged"
      :style="{ backgroundImage: `url(${background})` }"
    >
      <topbar class="logged__topbar" />
      <main class="logged__main">
        <transition
          name="view"
          mode="out-in"
        >
          <slot />
        </transition>
      </main>
      <chat-global />
    </div>
    <div v-else>
      <loading />
    </div>
  </transition>
</template>

<script>
import { computed, onErrorCaptured, ref } from 'vue';

import Topbar from '@/components/Topbar.vue';
import ChatGlobal from '@/components/ChatGlobal.vue';
import Loading from '@/views/Loading.vue';

import background from '@/assets/carpet.jpg';

import { useCardStore } from '@/stores/cardStore';
import { useAppStore } from '@/stores/appStore';
import { useProfileStore } from '@/stores/profileStore';
import { connect } from '@/socket';

export default {
  name: 'LoggedLayout',
  components: {
    Topbar,
    Loading,
    ChatGlobal,
  },
  setup() {
    onErrorCaptured((error) => {
      console.error('Error captured in LoggedLayout');
      console.error(error);
    });


    const cardStore = useCardStore();
    const appStore = useAppStore();
    const profileStore = useProfileStore();
    const cardIds = computed(() => cardStore.userCards);
    const isLoading = ref(true);

    const load = async () => {
      await connect();

      await profileStore.getProfile();
      await profileStore.getProfileAvatar();

      await cardStore.getUserCardIds();

      await appStore.preloadCardImages(cardIds.value);

      isLoading.value = false;
    };

    load();


    return {
      background,
      isLoading,
    };
  },
};
</script>

<style lang="scss" scoped>
.logged {
  display: grid;
  grid-template-areas: "topbar" "main";
  grid-template-rows: auto 1fr;
  min-height: 100%;
  background-size: 192px;
  image-rendering: pixelated;

  &__topbar {
    grid-area: topbar;
  }

  &__main {
    grid-area: main;
    padding: 24px;
    overflow-y: auto;
  }
}
.view-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.view-enter-active {
  transition: opacity 0.3s, transform 0.3s;
}

.view-enter-to {
  opacity: 1;
  transform: scale(1);
}

.view-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.view-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
