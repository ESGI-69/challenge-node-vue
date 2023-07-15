<template>
  <container class="game">
    <card-hand
      class="game__enemy-hand"
      :cards-fixed-quantity="5"
      :is-enemy="true"
    />
    GAME : {{ gameId }}
    <card-hand
      class="game__player-hand"
      :cards="[
        {
          id: 1,
          cost: 1,
          name: 'Card 1',
          rarity: 'common',
          description: 'This is a card.',
          type: 'minion',
          attack: 1,
          health: 1,
        },
        {
          id: 2,
          cost: 2,
          name: 'Card 2',
          rarity: 'common',
          description: 'This is a card.',
          type: 'minion',
          attack: 2,
          health: 2,
        },
        {
          id: 3,
          cost: 3,
          name: 'Card 3',
          rarity: 'common',
          description: 'This is a card.',
          type: 'minion',
          attack: 3,
          health: 3,
        },
        {
          id: 4,
          cost: 4,
          name: 'Card 4',
          rarity: 'common',
          description: 'This is a card.',
          type: 'minion',
          attack: 4,
          health: 4,
        },
        {
          id: 5,
          cost: 5,
          name: 'Card 5',
          rarity: 'common',
          description: 'This is a card.',
          type: 'minion',
          attack: 5,
          health: 5,
        },
      ]"
    />
  </container>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import Container from '@/components/Container.vue';
import CardHand from '@/components/games/CardHand.vue';

import { useGameStore } from '@/stores/gameStore';

export default {
  name: 'Game',
  components: {
    Container,
    CardHand,
  },
  setup() {
    const gameStore = useGameStore();
    const route = useRoute();

    const gameId = computed(() => gameStore.game.id);

    if (Object.keys(gameStore.game).length === 0) {
      gameStore.getGame(route.params.id);
    }

    return {
      gameId,
    };
  },
};
</script>

<style lang="scss" scoped>
.game {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  &__enemy-hand {
    position: absolute;
    top: -6rem;
    transform: rotate(180deg);
  }

  &__player-hand {
    position: absolute;
    bottom: -6rem;
  }
}
</style>
