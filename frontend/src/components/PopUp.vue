<template>
  <div
    v-if="isOpen"
    class="popup-wrapper"
  >
    <div
      class="popup-wrapper__overlay"
    />
    <container
      class="popup"
    >
      <div class="popup__header">
        <slot
          name="header"
        >
          <h2>
            Modal title
          </h2>
        </slot>
      </div>
      <div class="popup__content">
        <slot>
          Modal content
        </slot>
      </div>
      <div class="popup__footer">
        <button
          class="nes-btn is-primary"
          @click="confirm"
        >
          <slot name="confirm">
            Confirm
          </slot>
        </button>
      </div>
    </container>
  </div>
</template>

<script>
import Container from '@/components/Container.vue';

export default {
  name: 'Modal',
  components: {
    Container,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  emits: [ 'update:isOpen', 'close' ],
  setup(props, { emit }) {
    const confirm = () => {
      emit('update:isOpen', false);
      emit('close');
    };

    return {
      confirm,
    };
  },
};
</script>

<style lang="scss" scoped>
.popup-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1001;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .popup {
    z-index: 1002;
    width: 100%;
    max-width: 40vw;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

    display: flex;
    flex-direction: column;
    gap: 1rem;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    &__footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1rem;
    }
  }
}
</style>
