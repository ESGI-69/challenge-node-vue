<template>
  <container
    class="openning"
  >
    <draggable
      v-model="toOpen"
      class="openning__dropzone"
      :style="`background-image: url(${wallcrossImge})`"
      group="packs"
      :options="{
        pull: false,
      }"
      item-key="id"
    >
      <template #item="{ element }">
        <pack
          :id="element.id"
          class="openning__dropzone__pack"
        />
      </template>
    </draggable>
    <div
      class="openning__cards"
    >
      <transition-group
        name="card"
      >
        <card
          v-if="toOpen.length > 0"
          key="1"
          class="openning__cards__card"
        />
        <card
          v-if="toOpen.length > 0"
          key="2"
          class="openning__cards__card"
        />
        <card
          v-if="toOpen.length > 0"
          key="3"
          class="openning__cards__card"
        />
        <card
          v-if="toOpen.length > 0"
          key="4"
          class="openning__cards__card"
        />
        <card
          v-if="toOpen.length > 0"
          key="5"
          class="openning__cards__card"
        />
        <card
          v-if="toOpen.length > 0"
          key="6"
          class="openning__cards__card"
        />
        <card
          v-if="toOpen.length > 0"
          key="7"
          class="openning__cards__card"
        />
      </transition-group>
    </div>
  </container>
</template>

<script>
import { ref } from 'vue';
import Draggable from 'vuedraggable';

import Container from '@/components/Container.vue';
import Pack from '@/components/Pack.vue';

import wallcrossImge from '@/assets/wallcross.webp';

export default {
  name: 'PackOppening',
  components: {
    Draggable,
    Container,
    Pack,
  },
  setup() {
    const toOpen = ref([]);
    return {
      toOpen,
      wallcrossImge,
    };
  },
};
</script>

<style lang="scss" scoped>
.openning {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &__dropzone {
    display: flex;
    padding: 2rem;
    border: 0.25rem solid black;
    width: 230px;
    height: 370px;
    box-sizing: content-box;
    background-size: cover;
    background-position: center;

    &__pack {
      width: 100%;
    }
  }

  // Card in circle around the dropzone
  &__cards {
    position: absolute;
    top: 50%;
    left: 50%;

    &__card {
      $total-cards: 7; // Ajustez la valeur pour modifier le nombre de cartes
      $card-width: 200px; // Ajustez la valeur pour modifier la largeur des cartes
      $card-height: 300px; // Ajustez la valeur pour modifier la hauteur des cartes

      position: absolute;
      width: $card-width; /* Ajustez la largeur des cartes selon vos besoins */
      height: $card-height; /* Ajustez la hauteur des cartes selon vos besoins */
      background-color: #ccc; /* Couleur de fond des cartes */

      @for $i from 1 through $total-cards {
        $angle: $i * calc(360deg / $total-cards); // Calcule l'angle en degrés pour chaque carte
        $x: calc((500px * cos($angle)) - ($card-width / 2)); // Calcule les coordonnées x en utilisant la fonction calc
        $y: calc((500px * sin($angle)) - ($card-height / 2)); // Calcule les coordonnées y en utilisant la fonction calc

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
