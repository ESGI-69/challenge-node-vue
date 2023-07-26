<template>
  <container
    class="openning"
    :style="`background-image: url(${wallImage})`"
  >
    <draggable
      v-model="toOpen"
      class="openning__dropzone"
      :style="`background-image: url(${crossImage})`"
      :group="{
        name: 'packs',
        pull: !isDropZoneFull,
      }"
      item-key="id"
      @add="onAdd"
      @remove="onRemove"
    >
      <template #item="{ element }">
        <pack
          :id="element.id"
          class="openning__dropzone__pack"
        />
      </template>
    </draggable>
    <div
      v-if="refundedAmount > 0 && duplicatedCardIds.length > 0 && flippedCards.length === 0"
      class="openning__refund"
    >
      <span class="openning__refund__text">
        {{ duplicatedCardIds.length }} card(s) refunded:
      </span>
      <span class="openning__refund__amount">
        {{ refundedAmount }}
      </span>
      <i class="nes-icon coin is-small" />
    </div>
    <button
      v-if="flippedCards.length === 0 && isAPackHasBeenOpen"
      class="openning__button nes-btn is-primary"
      @click="reset"
    >
      Open annother pack
    </button>
    <div
      class="openning__cards"
    >
      <transition-group
        name="card"
      >
        <card
          v-for="card in cards"
          :key="card.id"
          v-bind="card"
          class="openning__cards__card"
          :is-start-face-down="true"
          :is-flippable="flippedCards.includes(card.id)"
          :is-refunded="duplicatedCardIds.includes(card.id)"
          @flip="cardFlipped"
        />
      </transition-group>
    </div>
  </container>
</template>

<script>
import { ref, computed } from 'vue';
import Draggable from 'vuedraggable';

import { usePackStore } from '@/stores/packStore';

import Container from '@/components/Container.vue';
import Pack from '@/components/Pack.vue';
import Card from '@/components/Card.vue';

import crossImage from '@/assets/cross.webp';
import wallImage from '@/assets/wall.webp';

export default {
  name: 'PackOppening',
  components: {
    Draggable,
    Container,
    Pack,
    Card,
  },
  props: {
    isDropZoneFull: {
      type: Boolean,
      default: false,
    },
  },
  emits: [ 'update:isDropZoneFull' ],
  setup(props, { emit }) {
    const packStore = usePackStore();
    const toOpen = ref([]);
    const flippedCards = ref([]);
    const isAPackHasBeenOpen = ref(false);

    const cards = computed(() => packStore.cardObtained);
    const duplicatedCardIds = computed(() => packStore.duplicatedCardIds);
    const refundedAmount = computed(() => packStore.refundedAmount);

    const onAdd = async () => {
      emit('update:isDropZoneFull', true);
      await packStore.openPack(toOpen.value[0].id);
      flippedCards.value = cards.value.map((card) => card.id);
    };

    const onRemove = () => {
      if (toOpen.value.length === 0) {
        emit('update:isDropZoneFull', false);
      } else {
        emit('update:isDropZoneFull', true);
      }
    };

    const reset = () => {
      emit('update:isDropZoneFull', false);
      toOpen.value = [];
      flippedCards.value = [];
      packStore.resetOpenning();
      isAPackHasBeenOpen.value = false;
      flippedCards.value = [];
    };

    const cardFlipped = ({ isFacingUp, id }) => {
      if (!isFacingUp) {
        return;
      }
      flippedCards.value = flippedCards.value.filter((cardId) => cardId !== id);
      if (flippedCards.value.length === 0) {
        isAPackHasBeenOpen.value = true;
      }
    };

    return {
      cardFlipped,
      cards,
      duplicatedCardIds,
      flippedCards,
      onAdd,
      onRemove,
      refundedAmount,
      toOpen,
      crossImage,
      isAPackHasBeenOpen,
      reset,
      wallImage,
    };
  },
};
</script>

<style lang="scss" scoped>
.openning {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  background-size: 342px;

  &__dropzone {
    display: flex;
    width: 230px;
    height: 370px;
    box-sizing: content-box;
    background-size: 70%;
    background-position: center;
    background-repeat: no-repeat;

    &__pack {
      width: 100%;
    }
  }

  &__refund {
    padding: .5rem;
    border: 0.25rem solid black;
    background: white;
  }

  // Card in circle around the dropzone
  &__cards {
    position: absolute;
    top: 50%;
    left: 50%;

    &__card {
      $total-cards: 5; // Ajustez la valeur pour modifier le nombre de cartes
      $card-width: 15rem; // Ajustez la valeur pour modifier la largeur des cartes
      $card-height: 21rem; // Ajustez la valeur pour modifier la hauteur des cartes

      position: absolute;
      width: $card-width; /* Ajustez la largeur des cartes selon vos besoins */
      height: $card-height; /* Ajustez la hauteur des cartes selon vos besoins */

      @for $i from 1 through $total-cards {
        $angle: $i * calc(360deg / $total-cards); // Calcule l'angle en degrés pour chaque carte
        $x: calc((450px * cos($angle)) - ($card-width / 2)); // Calcule les coordonnées x en utilisant la fonction calc
        $y: calc((450px * sin($angle)) - ($card-height / 2)); // Calcule les coordonnées y en utilisant la fonction calc

        &:nth-child(#{$i}) {
          left: calc(50% + #{$x});
          top: calc(50% + #{$y});

          &.card-enter-from {
            opacity: 0;
            left: calc(50%);
            top: calc(50%);
            transform: translate(-50%, -50%);
          }

          &.card-enter-active {
            transition: all 0.5s;
          }

          &.card-enter-to {
            opacity: 1;
            left: calc(50% + #{$x});
            top: calc(50% + #{$y});
          }

          &.from-center-leave-active {
            transition: all 0.5s;
          }

          &.card-leave {
            opacity: 1;
          }

          &.card-leave-active {
            opacity: 0;
            transform: translate(-50%, -50%);
            top: calc(50%);
            left: calc(50%);
            transition: all 0.5s;
          }
        }
      }
    }
  }
}
</style>
