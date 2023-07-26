<template>
  <div
    class="card"
    @[clickEvent]="flipCard"
  >
    <div
      class="card__container"
      :class="{
        'card__container--face-down': isFaceDown,
        'nes-pointer': isFlippable,
        'nes-pointer': isDraggable,
      }"
    >
      <div class="card__container__front">
        <template v-if="!isFrontHidden">
          <div
            v-if="isRefunded"
            class="card__container__front__refunded"
          >
            <span class="text">
              Refunded
            </span>
          </div>
          <card-cost
            class="card__container__front__cost"
            :cost="cost"
          />
          <div class="card__container__front__header">
            <div
              class="card__container__front__header__image"
              :style="{ backgroundImage: `url(${imageUrl})` }"
            />
            <span class="card__container__front__header__name">
              {{ name }}
            </span>
            <span
              class="card__container__front__header__rarity"
              :class="`card__container__front__header__rarity--${rarity}`"
            >
              {{ rarity }}
            </span>
          </div>
          <div class="card__container__front__content">
            <div class="card__container__front__content__description">
              {{ description }}
            </div>
            <span
              v-if="type"
              class="card__container__front__type"
            >
              {{ type }}
            </span>
          </div>
          <span
            v-if="attack"
            class="card__container__front__attack"
          >
            {{ attack }}
          </span>
          <span
            v-if="health"
            class="card__container__front__health"
          >
            {{ health }}
          </span>
        </template>
      </div>
      <div
        class="card__container__back"
        :style="`background-image: url(${backOfCard})`"
      />
    </div>
  </div>
</template>

<script>
import { toRefs, ref, computed } from 'vue';

import CardCost from '@/components/card/CardCost.vue';

import backOfCard from '@/assets/backOfCardResized.webp';

import breakGlass from '@/assets/breakglass.svg';

export default {
  name: 'Card',
  components: {
    CardCost,
  },
  props: {
    /**
     * The id of the card.
     */
    id: {
      type: Number,
      default: null,
    },
    /**
     * The cost of the card.
     */
    cost: {
      type: Number,
      default: null,
    },
    /**
     * The name of the card.
     */
    name: {
      type: String,
      default: null,
    },
    /**
     * The rarity of the card. Can be one of the following:
     * - `common`
     * - `rare`
     * - `epic`
     * - `legendary`
     */
    rarity: {
      type: String,
      default: null,
      validator: (value) => [
        'common',
        'rare',
        'epic',
        'legendary',
      ].includes(value),
    },
    /**
     * The description of the card.
     */
    description: {
      type: String,
      default: null,
    },
    /**
     * The type of the card.
     * @note Not supported yet.
     */
    type: {
      type: String,
      default: null,
    },
    /**
     * The attack of the card.
     */
    attack: {
      type: Number,
      default: null,
      min: 1,
    },
    /**
     * The health of the card.
     */
    health: {
      type: Number,
      default: null,
    },
    /**
     * Is the card face-down
     */
    isStartFaceDown: {
      type: Boolean,
      default: false,
    },
    /**
     * Is the card flippable
     */
    isFlippable: {
      type: Boolean,
      default: false,
    },
    /**
     * Is the card refunded
     */
    isRefunded: {
      type: Boolean,
      default: false,
    },
    /**
     * Is the front of the card is hiddent
     */
    isFrontHidden: {
      type: Boolean,
      default: false,
    },
    /**
     * Is the card draggable ? Change the cursor.
     */
    isDraggable: {
      type: Boolean,
      default: false,
    },
  },
  emits: [ 'flip' ],
  setup(props, { emit }) {
    const { isFlippable, id } = toRefs(props);

    const clickEvent = computed(() => isFlippable.value ? 'click' : null);
    const imageUrl = computed(() => `${import.meta.env.VITE_API}/cards/${id.value}/image`);
    const isFaceDown = ref(props.isStartFaceDown);

    const flipCard = () => {
      isFaceDown.value = !isFaceDown.value;
      emit('flip', { isFacingUp: !isFaceDown.value, id: id.value });
    };

    return {
      clickEvent,
      flipCard,
      isFaceDown,
      backOfCard,
      imageUrl,
      breakGlass,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
  user-select: none;
  width: 17rem;
  height: 23rem;
  perspective: 27rem;

  &__container {
    position: relative;
    height: calc(100% - 2rem);
    transition: transform 1s;
    transform-style: preserve-3d;
    margin: 1rem;

    &--face-down {
      transition: transform 0.5s;
      transform: rotateY(180deg);
    }

    &--is-flippable {
      cursor: pointer;
    }

    &__front, &__back {
      position: absolute;
      height: 100%;
      width: 100%;
      backface-visibility: hidden;
    }

    &__front {
      background: red;
      display: grid;
      grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
      grid-template-columns: 1fr;
      border: 4px solid black;
      transition: transform 0.1s ease-in-out;

      &__refunded {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 1;
        user-select: none;

        .text {
          color: red;
          border: 0.5rem solid red;
          padding: 0.5rem;
          font-size: 1.5rem;
          text-transform: uppercase;
          transform: rotate(-35deg);
          background: white;
        }
      }

      &__attack, &__health {
        z-index: 1;
        position: absolute;
        height: 2rem;
        width: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        border-radius: 50%;
      }

      &__cost {
        top: -1rem;
        left: -1rem;
        z-index: 1;
        position: absolute;
      }

      &__attack {
        background-color: red;
        bottom: -1rem;
        left: -1rem;
      }

      &__health {
        background-color: green;
        bottom: -1rem;
        right: -1rem;
      }

      &__header {
        position: relative;

        &__image {
          width: 100%;
          height: 10rem;
          background-size: cover;
          background-position: center;
        }

        &__name {
          box-sizing: border-box;
          width: calc(100% - 4rem);
          margin: 0 2rem;
          background-color: #a600ff;
          color: white;
          position: absolute;
          height: 1.5rem;
          font-size: 1.25rem;
          bottom: 2rem;
          display: flex;
          justify-content: center;
        }

        &__rarity {
          box-sizing: border-box;
          width: calc(100% - 8rem);
          margin: 0 4rem;
          color: white;
          position: absolute;
          height: 1rem;
          font-size: 0.75rem;
          bottom: 1rem;
          display: flex;
          justify-content: center;

          &--common {
            background-color: #b3b3b3;
          }

          &--rare {
            background-color: #0070dd;
          }

          &--epic {
            background-color: #a335ee;
          }

          &--legendary {
            background-color: #ff8000;
          }
        }
      }

      &__type {
        box-sizing: border-box;
        width: 100%;
        margin: 0.5rem 0;
        background-color: #a600ff;
        color: white;
        position: absolute;
        font-size: 0.75rem;
        bottom: 0;
        display: flex;
        justify-content: center;
      }

      &__content {
        &__description {
          box-sizing: border-box;
          padding: 0.5rem;
          font-size: 0.75rem;
          overflow-y: scroll;
          height: 100%;
        }
      }
    }

    &__back {
      border: 4px solid black;
      background-size: cover;
      background-position: center;
      transform: rotateY( 180deg );
    }
  }
}

.card_animation {
  animation: rotate 2s;
}

  @keyframes rotate { // Le balancement de la carte
    0% {
      transform: rotateX(0deg);
      box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 0px 12px rgba(0,0,0,0.22);
    }
    7% {
      transform: rotateX(-5deg);
      box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 20px 12px rgba(0,0,0,0.22);
    }
    25% {
      transform: rotateX(10deg);
      box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 -20px 12px rgba(0,0,0,0.22);
    }
    100% {
      transform: rotateX(0deg);
      box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 0px 12px rgba(0,0,0,0.22);
    }
  }
  .breakCard{ // L'animation de la carte qui se brise
  -webkit-mask-image: url(http://localhost:8080/src/assets/Composition-1noloop.gif);
  mask-position: center;
  animation: zoom 2.5s ease-out;
  animation-fill-mode: forwards ;
}

@keyframes zoom {
  0% {
    transform: scale(1);
    opacity: 1;
    filter: grayscale(0%) drop-shadow(0 0 0.5rem rgb(3, 3, 3));
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
    filter: grayscale(100%);

  }
}
</style>
