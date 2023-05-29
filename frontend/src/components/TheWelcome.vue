<template>
  <main>
    <draggable
      v-model="myArray"
      class="draggableBox"
      group="people"
      item-key="id"
      ghost-class="ghost"
    >
      <template #item="{element}">
        <card v-bind="element" />
      </template>
    </draggable>
    <draggable
      v-model="myArray2"
      class="draggableBox"
      group="people"
      ghost-class="ghost"
      item-key="id"
    >
      <template #item="{element}">
        <card v-bind="element" />
      </template>
    </draggable>
  </main>
</template>

<script>
import { ref } from 'vue';
import Draggable from 'vuedraggable';
import Card from '@/components/Card.vue';

export default {
  name: 'TheWelcome',
  components: {
    Card,
    Draggable,
  },
  setup() {
    /**
     * @typedef {{
     *  id: number,
     *  cost: number,
     *  image: string,
     *  name: string,
     *  rarity: 'common' | 'rare' | 'epic' | 'legendary',
     *  description: string,
     *  type: string,
     *  attack: number,
     *  health: number,
     * }} Card
     */

    /**
     * @typedef {import("vue").Ref<Card[]>}
     */
    const myArray = ref([
      {
        id: 1,
        cost: 1,
        image: 'https://art.hearthstonejson.com/v1/orig/EX1_001.png',
        name: 'John',
        rarity: 'common',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies ultricies, nunc nunc ultricies nunc, vitae ultricies nisl nisl eget nisl. Donec auctor, nisl eget ultricies ultricies, nunc nunc ultricies nunc, vitae ultricies nisl nisl eget nisl.',
        attack: 1,
        health: 2,
      },
      {
        id: 2,
        cost: 12,
        image: 'https://art.hearthstonejson.com/v1/orig/EX1_116.png',
        name: 'Jane',
        rarity: 'rare',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies ultricies, nunc nunc ultricies nunc, vitae ultricies nisl nisl eget nisl. Donec auctor, nisl eget ultricies ultricies, nunc nunc ultricies nunc, vitae ultricies nisl nisl eget nisl.',
        attack: 1,
        health: 2,
      },
      {
        id: 3,
        cost: 12,
        image: 'https://art.hearthstonejson.com/v1/orig/CS2_231.png',
        name: 'Jean',
        rarity: 'epic',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies ultricies, nunc nunc ultricies nunc, vitae ultricies nisl nisl eget nisl. Donec auctor, nisl eget ultricies ultricies, nunc nunc ultricies nunc, vitae ultricies nisl nisl eget nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies ultricies, nunc nunc ultricies nunc, vitae ultricies nisl nisl eget nisl. Donec auctor, nisl eget ultricies ultricies, nunc nunc ultricies nunc, vitae ultricies nisl nisl eget nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies ultricies, nunc nunc ultricies nunc, vitae ultricies nisl nisl eget nisl. Donec auctor, nisl eget ultricies ultricies, nunc nunc ultricies nunc, vitae ultricies nisl nisl eget nisl.',
        attack: 1,
        health: 2,
      },
      {
        id: 4,
        cost: 12,
        image: 'https://art.hearthstonejson.com/v1/orig/CS2_073.png',
        name: 'Juan',
        rarity: 'legendary',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies ultricies, nunc nunc ultricies nunc, vitae ultricies nisl nisl eget nisl. Donec auctor, nisl eget ultricies ultricies, nunc nunc ultricies nunc, vitae ultricies nisl nisl eget nisl.',
        attack: 1,
        health: 2,
      },
    ]);
    const myArray2 = ref([
      {
        id: 1,
        cost: 12,
        image: 'https://art.hearthstonejson.com/v1/orig/NAX11_02.png',
        name: 'Johan',
        rarity: 'rare',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies ultricies, nunc nunc ultricies nunc, vitae ultricies nisl nisl eget nisl. Donec auctor, nisl eget ultricies ultricies, nunc nunc ultricies nunc, vitae ultricies nisl nisl eget nisl.',
        attack: 1,
        health: 2,
      },
    ]);

    return {
      myArray,
      myArray2,
    };
  },
};
</script>

<style lang="scss" scoped>
main {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
  .draggableBox {
    border: 1px solid black;
    display: flex;
    gap: 0.25rem;
  }
}

.ghost {
  opacity: 0.5;
}

.drag {
  background-color: green;
}

.chosen {
  // background-color: yellow;
}
</style>
