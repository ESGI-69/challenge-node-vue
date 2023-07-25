<template>
  <div class="card">
    <span
      class="card__cost"
    >
      {{ cost }}
    </span>
    <span class="card__name">
      {{ name }}
    </span>
  </div>
</template>

<script>
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
    };
  },
};
</script>

<style lang="scss" scoped>
.card{
    position: relative;
    display: flex;
    flex-direction: row;
    width: 80%;
    height: 5rem;
    // text-align: center;
    align-items: center;
    background-color: red;
    justify-content: center;
    gap: 1rem;

    &__cost{
        // position: absolute;
        // font-size: 1rem;
        left: 1rem;
        color: white;
    }

    &__name{
        margin-left: 1rem;
        font-size: 1rem;
        text-align: left;
        align-items: left;
    }

    &__add-cart{
        // position: absolute;
        // right: 1rem;
        font-size: 2rem;
        color: white;

        &:hover{
            color: rgb(0, 172, 185);
        }
    }

}
</style>
