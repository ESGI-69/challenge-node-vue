<template>
  <div
    class="not-logged"
    :style="{ backgroundImage: `url(${notLoggedBackground})` }"
  >
    <slot />
    <span class="not-logged__hash">
      Version {{ hash }}
    </span>
  </div>
</template>

<script>
import notLoggedBackground from '@/assets/notLoggedBackground.webp';

export default {
  name: 'LoggedLayout',
  setup() {
    const hash = import.meta.env.VITE_GIT_HASH;
    return {
      hash,
      notLoggedBackground,
    };
  },
};
</script>

<style lang="scss" scoped>
.not-logged {
  &__hash {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 0.5rem;
    color: white;
    background-color: black;
    padding: 0.25rem;
    opacity: 0.5;
  }
}
</style>
