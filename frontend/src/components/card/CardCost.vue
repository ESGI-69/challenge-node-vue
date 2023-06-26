<template>
  <div class="card-cost">
    {{ cost }}
  </div>
</template>

<script>
export default {
  name: 'CardCost',
  props: {
    cost: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.card-cost {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
  width: 2rem;
  color: white;
  border-radius: 50%;
  background-color: blue;
}
</style>
