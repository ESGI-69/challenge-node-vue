<template>
  <div
    v-if="isOpen"
    class="modal-wrapper"
  >
    <div
      class="modal-wrapper__overlay"
      @click="cancel"
    />
    <container class="modal">
      <div class="modal__header">
        <slot name="header">
          <h2>Error</h2>
        </slot>
      </div>
      <div class="modal__content">
        <slot>
          <p>An error occurred.</p>
        </slot>
      </div>
      <div class="modal__footer">
        <button
          class="nes-btn is-error"
          @click="cancel"
        >
          <slot name="cancel">
            OK
          </slot>
        </button>
      </div>
    </container>
  </div>
</template>

<script>
import Container from '@/components/Container.vue';

export default {
  name: 'ModalError',
  components: {
    Container,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  emits: [ 'update:isOpen', 'cancel' ],
  setup(props, { emit }) {
    const cancel = () => {
      emit('update:isOpen', false);
      emit('cancel');
    };

    return {
      cancel,
    };
  },
};
</script>

<style lang="scss" scoped>
.modal-wrapper {
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

  .modal {
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

