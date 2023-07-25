<template>
  <div class="card">
    <span
      class="card__cost"
      :style="`background-image: url(${ManaCrystal})`"
    >
      {{ cost }}
    </span>
    <span class="card__name">
      {{ name }}
    </span>
    <img
      class="card__trash"
      :src="Trash"
      alt="Trash"
    >
  </div>
</template>

<script>
import ManaCrystal from '@/assets/mana-crystal.png';
import Trash from '@/assets/delete.png';

export default {
  name: 'Card',
  components: {
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
     * Is the card draggable ? Change the cursor.
     */
    isDraggable: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
      ManaCrystal,
      Trash,
    };
  },
};
</script>

<style lang="scss" scoped>
.card{
    position: relative;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 4rem;
    background-color: #36a3f7;
    border: solid 3px black;
    border-radius: 1rem;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;

    &__cost{
      position: absolute;
      display: flex;
      left: 1rem;
      justify-content: center;
      align-items: center;
      height: 2rem;
      width: 2rem;
      color: white;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
    }

    &__name{
      font-size: 0.75rem;
      text-align: left;
      align-items: left;
      color: white;
    }

    &__trash{
      position: absolute;
      opacity: 0;
      right: 1rem;
      height: 2rem;
      width: 2rem;
    }

    &:hover{
      opacity: 0.8;
      .card__trash{
        opacity: 1;
      }
    }

}
</style>
