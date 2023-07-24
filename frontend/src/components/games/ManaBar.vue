<template>
  <div class="mana-bar">
    <mana
      v-for="i in maxMana"
      :key="i"
      :is-empty="i > mana"
      :cost="i"
    />
  </div>
</template>

<script>
import CardCost from '../card/CardCost.vue';

export default {
  name: 'ManaBar',
  components: {
    Mana: CardCost,
  },
  props: {
    mana: {
      type: Number,
      required: true,
    },
    maxMana: {
      type: Number,
      default: 10,
    },
  },
};
</script>

<style lang="scss" scoped>
.mana-bar {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  gap: 0.5rem;
}
</style>
