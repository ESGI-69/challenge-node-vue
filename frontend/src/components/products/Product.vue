<template>
  <p>{{ name }}</p>
  <p>{{ price }} €</p>
  <p>{{ categorie }}</p>
  <img 
    v-if="categorie === 'COINS'"
    :src="coinBag"
    alt=""
    width="160"
    height="160"
  >

  <p>--------------------------------</p>
</template>

<script>
import coinBag from '@/assets/coinBag.jpeg';
export default {
  name: 'Product',
  props: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    categorie: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    return {
      props,
      coinBag,
    };
  },
};

</script>
