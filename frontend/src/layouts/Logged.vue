<template>
  <div class="logged">
    <nav>
      <router-link to="/">
        Home
      </router-link>
      <router-link to="/about">
        About
      </router-link>
    </nav>
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
export default {
  name: 'LoggedLayout',
  components: {
  },
};
</script>

<style lang="scss" scoped>
.logged {
  display: grid;
  grid-template-areas: "topbar topbar" "sidebar main";
  grid-template-rows: auto 1fr;
  grid-template-columns: 200px 1fr;
  min-height: 100%;

  @media (max-width: 768px) {
    grid-template-areas: "topbar" "main";
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
    padding-bottom: 4rem;
  }

  &__topbar {
    grid-area: topbar;
  }

  &__sidebar {
    grid-area: sidebar;
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