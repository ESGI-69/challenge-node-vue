<template>
  <div
    class="not-logged"
    :style="{ backgroundImage: `url(${notLoggedBackground})` }"
  >
    <slot />
  </div>
</template>

<script>
import notLoggedBackground from '@/assets/notLoggedBackground.webp';

export default {
  name: 'LoggedLayout',
  setup() {
    return {
      notLoggedBackground,
    };
  },
};
</script>

<style lang="scss" scoped>
.not-logged {
  &__main {
    box-sizing: border-box;
    height: 100%;
    padding: 24px;
    overflow-y: auto;
  }
}
</style>