<template>
  <div
    class="game"
    @mouseup="mouseUp"
  >
    <container
      class="game__container"
      @mousemove="moveAttackLine"
    >
      <card-hand
        class="game__container__enemy-hand"
        :cards-fixed-quantity="5"
        :is-enemy="true"
      />
      <player-avatar
        :user-avatar="enemyAvatar"
        :is-enemy="true"
        :hp-count="enemyHp"
        class="avatar__container__enemy"
        @mouseup="attackPlayer"
        @mouseover="mouseEnterEnemy"
        @mouseleave="mouseLeaveEnemy"
      />

      <div class="game__container__board">
        <card
          v-for="card in enemyCardsOnBoard"
          :key="card.id"
          :ref="setCardRef(card.id)"
          class="enemy-card"
          v-bind="card"
          @mouseup="(event) => attackEnemy(card.id, event)"
          @mouseover="mouseEnterEnemy"
          @mouseleave="mouseLeaveEnemy"
        />
      </div>
      <turn-bar
        class="game__container__turn-bar"
        :is-player-turn="isPlayerTurn"
        :turn-started-at="turnStartedAt"
        :turn-duration="30"
        @end-turn="endTurn"
      />
      <!-- draggable=".none" is for disabling the drag effect -->
      <draggable
        v-model="cardsOnBoard"
        :group="{
          name: 'cards',
          pull: false,
          put: isPlayerTurn,
        }"
        item-key="id"
        draggable=".none"
        class="game__container__board"
        @add="onAdd"
      >
        <template #item="{ element }">
          <card
            v-bind="element"
            :ref="setCardPlayerRef(element.id)"
            class="card-hand__card-wrapper__card"
            :class="{
              'nes-pointer': isPlayerTurn,
            }"
            @mousedown="(event) => startAttack(element.id, element.attack, event)"
            @mouseup="cancelAttack"
          />
        </template>
      </draggable>
      <player-avatar
        :user-avatar="avatarUrl"
        :is-enemy="false"
        :hp-count="myHp"
        class=""
      />
      <card-hand
        class="game__container__player-hand"
        :is-player-turn="isPlayerTurn"
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
        ]"
      />
    </container>
    <pop-up
      v-model:isOpen="isForfeitModalOpen"
      @close="goHome"
    >
      <template #header>
        <h2>Forfeit</h2>
      </template>
      <p>Your opponent has forfeited.</p>
      <p>You win!</p>
      <p>50px & 50<i class="nes-icon coin is-small" /></p>
      <template #confirm>
        <span>Nice</span>
      </template>
    </pop-up>
    <attack-line
      ref="attackLine"
      :attack="attackDamage"
      :is-valid="isHoveringEnemy"
    />
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AttackLine from '@/components/AttackLine.vue';
import Card from '@/components/Card.vue';
import CardHand from '@/components/games/CardHand.vue';
import Container from '@/components/Container.vue';
import Draggable from 'vuedraggable';
import PopUp from '@/components/PopUp.vue';
import TurnBar from '@/components/games/TurnBar.vue';
import PlayerAvatar from '@/components/games/PlayerAvatar.vue';

import { useGameStore } from '@/stores/gameStore';
import { useProfileStore } from '@/stores/profileStore';
import { socket } from '@/socket';

export default {
  name: 'Game',
  components: {
    AttackLine,
    Card,
    CardHand,
    Container,
    Draggable,
    PopUp,
    TurnBar,
    PlayerAvatar,
  },
  setup() {
    const attackLine = ref(null);

    let cardsEnemyRef = [];
    let cardPlayerRef = [];
    const setCardRef = (cardId) => (el) => {
      cardsEnemyRef[cardId] = el;
    };
    const setCardPlayerRef = (cardId) => (el) => {
      cardPlayerRef[cardId] = el;
    };


    const gameStore = useGameStore();
    const profileStore = useProfileStore();
    const route = useRoute();
    const router = useRouter();

    const gameId = computed(() => gameStore.game.id?.toUpperCase());
    const isPlayerTurn = computed(() => gameStore.game.current_player === profileStore.getId);
    const turnStartedAt = computed(() => gameStore.game.turnStartedAt);

    const avatarUrl = computed(() => profileStore.avatarUrl);

    const enemyId = computed(() => (gameStore.game.first_player === profileStore.getId) ? gameStore.game.second_player : gameStore.game.first_player);

    const enemyAvatar = computed(() => `${import.meta.env.VITE_API}/users/${enemyId.value}/avatar`);

    const myHp = computed(() => gameStore.game.first_player === profileStore.getId ? gameStore.game.first_player_hp : gameStore.game.second_player_hp);
    const enemyHp = computed(() => gameStore.game.first_player === profileStore.getId ? gameStore.game.second_player_hp : gameStore.game.first_player_hp);

    const isForfeitModalOpen = ref(false);

    const cardsOnBoard = ref([
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
    ]);

    const enemyCardsOnBoard = ref([
      {
        id: 6,
        cost: 6,
        name: 'Card 6',
        rarity: 'common',
        description: 'This is a card.',
        type: 'minion',
        attack: 6,
        health: 6,
      },
    ]);

    const endTurn = () => {
      gameStore.endTurn();
    };

    const goHome = () => {
      router.push({ name: 'home' });
    };

    if (Object.keys(gameStore.game).length === 0) {
      gameStore.getGame(route.params.id)
        // eslint-disable-next-line promise/prefer-await-to-then
        .catch(() => {
          goHome();
        });
    }

    socket.on('game:forfeited', (game) => {
      gameStore.setGame(game);
      isForfeitModalOpen.value = true;
    });

    const onAdd = () => {
      // When a card is added to the board
      // console.log('onAdd');
      // console.log(event);
    };

    // Drag and drop attack logic

    let attack = reactive({
      attacker: null,
      target: null,
      attackerRef: null,
      targetRef: null,
    });
    const attackDamage = ref(0);

    const isHoveringEnemy = ref(false);

    /**
     * The user mousedown on his card to attack
     * @param {number} cardId
     * @param {MouseEvent} event
     */
    const startAttack = (cardId, cardDamage, event) => {
      if (!isPlayerTurn.value) return;
      attackLine.value.startDrawing(event);
      attack.attacker = cardId;
      attack.attackerRef = cardPlayerRef[cardId];
      attackDamage.value = cardDamage;
    };

    const cancelAttack = () => {
      attackLine.value.resetLine();
      isHoveringEnemy.value = false;
      attack = {
        attacker: null,
        target: null,
      };
    };

    /**
     * @param {number} cardId
     * @param {MouseEvent} event
     */
    const attackEnemy = (cardId) => {
      if (!isPlayerTurn.value) return;
      if (!attack.attacker) return;
      attack.target = cardId;

      moveElement(cardPlayerRef[attack.attacker].$el, cardsEnemyRef[cardId].$el);

      sendAttack();
    };

    const moveElement = (element, targetPosition) => {

      element.style.transition = '0.35s ease-out';

      const distanceX = targetPosition.getBoundingClientRect().left - element.getBoundingClientRect().left;
      const distanceY = (targetPosition.getBoundingClientRect().top - element.getBoundingClientRect().top) + ((element.getBoundingClientRect().height) / 2)  ;

      const angle = Math.atan2(element.getBoundingClientRect().left - targetPosition.getBoundingClientRect().left, element.getBoundingClientRect().top - targetPosition.getBoundingClientRect().top);
      const rotation = angle * (180 / Math.PI) * -1;

      element.style.transform = `translate(${distanceX}px, ${distanceY}px) rotate(${rotation}deg)`;
      element.children[0].classList.add('card_animation');

      setTimeout(() => {
        element.style.boxShadow = 'none';
        element.style.transform = 'translate(0, 0)';
        element.children[0].classList.remove('card_animation');
      }, 1300);

    };

    const attackPlayer = () => {
      if (!isPlayerTurn.value) return;
      if (!attack.attacker) return;
      attack.target = 'player';
      sendAttack();
    };

    const sendAttack = () => {
      if (!isPlayerTurn.value) return;
      socket.emit('game:attack', {
        gameId: gameStore.game.id,
        attacker: attack.attacker,
        target: attack.target,
      });
      cancelAttack();
    };

    /**
     * @param {MouseEvent} event
     */
    const mouseUp = (event) => {
      if (!event.target) return;
      const isOnCard = event.target.classList.value.startsWith('card__');
      if (!isOnCard) {
        cancelAttack();
      }
    };

    /**
     * @param {MouseEvent} event
     */
    const moveAttackLine = (event) => {
      if (!isPlayerTurn.value) return;
      if (!attack.attacker) return;
      attackLine.value.drawLine(event);
    };

    const mouseEnterEnemy = () => {
      if (!isPlayerTurn.value) return;
      if (!attack.attacker) return;
      isHoveringEnemy.value = true;
    };

    const mouseLeaveEnemy = () => {
      if (!isPlayerTurn.value) return;
      if (!attack.attacker) return;
      isHoveringEnemy.value = false;
    };

    // Turn logic

    socket.on('game:turn:end', (game) => {
      gameStore.setGame(game);
      cancelAttack();
    });

    socket.on('game:turn:start', (game) => {
      gameStore.setGame(game);
    });

    return {
      attack,
      attackDamage,
      attackEnemy,
      attackLine,
      cancelAttack,
      cardsOnBoard,
      enemyCardsOnBoard,
      endTurn,
      attackPlayer,
      startAttack,
      mouseUp,
      gameId,
      goHome,
      isForfeitModalOpen,
      isHoveringEnemy,
      isPlayerTurn,
      mouseEnterEnemy,
      mouseLeaveEnemy,
      moveAttackLine,
      onAdd,
      turnStartedAt,
      avatarUrl,
      enemyAvatar,
      myHp,
      enemyHp,
      setCardRef,
      setCardPlayerRef,
    };
  },
};
</script>

<style lang="scss" scoped>
.game {
  height: 100%;

  &__container {
    position: relative;
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    &__enemy-hand {
      position: absolute;
      top: -12rem;
      transform: rotate(180deg);
    }

    &__player-hand {
      position: absolute;
      bottom: -12rem;
    }

    &__board {
      width: 100%;
      border: 0.25rem solid black;
      height: 400px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
