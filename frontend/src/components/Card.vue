<template>
  <div class="card">
    <span class="card__cost">
      {{ cost }}
    </span>
    <div class="card__header">
      <div
        class="card__header__image"
        :style="{ backgroundImage: `url(${image})` }"
      />
      <span class="card__header__name">
        {{ name }}
      </span>
      <span
        class="card__header__rarity"
        :class="`card__header__rarity--${rarity}`"
      >
        {{ rarity }}
      </span>
    </div>
    <div class="card__content">
      <div class="card__content__description">
        {{ description }}
      </div>
      <span
        v-if="type"
        class="card__type"
      >
        {{ type }}
      </span>
    </div>
    <span
      v-if="attack"
      class="card__attack"
    >
      {{ attack }}
    </span>
    <span
      v-if="health"
      class="card__health"
    >
      {{ health }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    /**
     * The cost of the card.
     */
    cost: {
      type: Number,
      required: true,
    },
    /**
     * The image of the card.
     */
    image: {
      type: String,
      required: true,
    },
    /**
     * The name of the card.
     */
    name: {
      type: String,
      required: true,
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
      required: true,
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
      required: true,
    },
    /**
     * The type of the card.
     * @note Not supported yet.
     */
    type: {
      type: String,
      required: false,
      default: null,
    },
    /**
     * The attack of the card.
     */
    attack: {
      type: Number,
      required: false,
      default: null,
      min: 1,
    },
    /**
     * The health of the card.
     */
    health: {
      type: Number,
      required: false,
      default: null,
    },
  },
  setup() {

  },
};
</script>

<style lang="scss" scoped>
.card {
  display: grid;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-columns: 1fr;
  width: 15rem;
  height: 21rem;
  border: 1px solid black;
  position: relative;
  margin: 1rem;
  transition: transform 0.1s ease-in-out;

  &__cost, &__attack, &__health {
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
    background-color: blue;
    top: -1rem;
    left: -1rem;
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

  &__content {
    &__description {
      box-sizing: border-box;
      padding: 0.5rem;
      font-size: 0.75rem;
      overflow-y: scroll;
      height: 100%;
    }
  }

  &:hover {
    transform: scale(1.1);
  }
}
</style>
