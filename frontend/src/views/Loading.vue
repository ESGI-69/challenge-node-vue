<template>
  <div
    class="loading"
    :style="{ backgroundImage: `url(${wall})` }"
  >
    <h1>
      Loading...
    </h1>
    <progress
      class="nes-progress is-dark is-primary"
      :value="progress"
      :max="cardCount"
    />
    <span>
      {{ status }}
    </span>
  </div>
</template>

<script>
import { computed } from 'vue';

import { useCardStore } from '@/stores/cardStore';
import { useAppStore } from '@/stores/appStore';
import { useProfileStore } from '@/stores/profileStore';

import wall from '@/assets/tiling_wall.png';

export default {
  name: 'Loading',
  setup() {
    const cardStore = useCardStore();
    const appStore = useAppStore();
    const profileSotre = useProfileStore();
    const cardCount = computed(() => cardStore.cards.length);
    const progress = computed(() => appStore.preloadedCardImages);
    const isProfileLoading = computed(() => profileSotre.isProfileLoading);
    const status = computed(() => {
      if (isProfileLoading.value) return 'Retrieving profile...';
      if (cardCount.value === 0) return 'Retrieving cards...';
      if (progress.value !== cardCount.value) return `Loading card images ${progress.value}/${cardCount.value} ...`;
      if (progress.value === cardCount.value) return 'Done!';
      return 'Downloading more ram...';
    });

    return {
      wall,
      cardCount,
      progress,
      status,
    };
  },
};
</script>

<style lang="scss" scoped>
.loading {
  color: white;
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  padding: 6rem;
  image-rendering: pixelated;
  background-size: 256px;

  h1 {
    font-weight: normal;
  }
}
</style>
