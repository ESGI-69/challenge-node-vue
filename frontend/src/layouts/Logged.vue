<template>
  <div
    class="logged"
    :style="{ backgroundImage: `url(${grass})` }"
  >
    <transition-group
      name="fade"
      tag="main"
      class="logged__main"
    >
      <slot />
    </transition-group>
  </div>
</template>

<script>
import { computed, onErrorCaptured } from 'vue';

import grass from '@/assets/totally-not-stolen-grass.png';

import { useCardStore } from '@/stores/cardStore';
import { useAppStore } from '@/stores/appStore';
import { useProfileStore } from '@/stores/profileStore';

export default {
  name: 'LoggedLayout',
  async setup() {
    onErrorCaptured((error) => {
      console.error('Error captured in LoggedLayout');
      console.error(error);
    });

    const cardStore = useCardStore();
    const appStore = useAppStore();
    const profileSotre = useProfileStore();
    const cards = computed(() => cardStore.cards);

    await profileSotre.getProfile();

    await cardStore.getCards();

    const cardImages = cards.value.map((card) => card.image);
    await appStore.preloadCardImages(cardImages);

    return {
      grass,
    };
  },
};
</script>

<style lang="scss" scoped>
.logged {
  display: grid;
  grid-template-areas: "topbar" "main";
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
}
</style>