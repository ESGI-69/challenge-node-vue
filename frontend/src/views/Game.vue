<template>
  <div
    class="game"
    @mouseup="mouseUp"
  >
    <container
      v-if="gameId"
      class="game__container"
      @mousemove="moveAttackLine"
    >
      <card-hand
        class="game__container__enemy-hand"
        :cards-fixed-quantity="opponentCardsCount"
        :is-enemy="true"
      />
      <player-avatar
        ref="enemyRef"
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
          v-for="{ card, currentHealth } in opponentBoardCardInstances"
          :key="card.id"
          :ref="setCardRef(card.id)"
          class="enemy-card"
          v-bind="card"
          :health="currentHealth"
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
        :model-value="myBoardCardInstances"
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
            :ref="setCardPlayerRef(element.card.id)"
            v-bind="element.card"
            :health="element.currentHealth"
            class="game__container__board__card"
            :class="{
              'nes-pointer': isPlayerTurn && !element.allreadyAttacked,
              'cant-attack': !isPlayerTurn || element.allreadyAttacked,
            }"
            @mousedown="(event) => isPlayerTurn && !element.allreadyAttacked ? startAttack(element.card.id, element.card.attack, event) : null"
            @mouseup="cancelAttack"
          />
        </template>
      </draggable>
      <player-avatar
        ref="playerRef"
        :user-avatar="avatarUrl"
        :is-enemy="false"
        :hp-count="myHp"
        class=""
      />
      <card-hand
        class="game__container__player-hand"
        :is-player-turn="isPlayerTurn"
        :player-mana="playerMana"
        :cards="hand"
      />
      <mana-bar
        class="game__container__mana-bar game__container__mana-bar--player"
        :mana="playerMana"
      />
      <mana-bar
        class="game__container__mana-bar game__container__mana-bar--enemy"
        :mana="opponentMana"
      />
    </container>
    <attack-line
      ref="attackLine"
      :attack="attackDamage"
      :is-valid="isHoveringEnemy"
    />
    <pop-up
      v-model:isOpen="isForfeitModalOpen"
      @close="goHome"
    >
      <template #header>
        <h2>Forfeit</h2>
      </template>
      <p>Your opponent has forfeited.</p>
      <p>You win!</p>
      <p>150px & 150<i class="nes-icon coin is-small" /></p>
      <template #confirm>
        <span>Nice</span>
      </template>
    </pop-up>
    <pop-up
      v-model:isOpen="isLooseModalOpen"
      @close="goHome"
    >
      <template #header>
        <h2>You have been defeated! 🗿</h2>
      </template>
      <p>You loose!</p>
      <template #confirm>
        <span>Ok</span>
      </template>
    </pop-up>
    <pop-up
      v-model:isOpen="isWinnerModalOpen"
      @close="goHome"
    >
      <template #header>
        <h2>You have defeated your opponent! 🗿</h2>
      </template>
      <p>You win!</p>
      <p>50px & 50<i class="nes-icon coin is-small" /></p>
      <template #confirm>
        <span>Awesome</span>
      </template>
    </pop-up>
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
import ManaBar from '@/components/games/ManaBar.vue';

import { useGameStore } from '@/stores/gameStore';
import { useProfileStore } from '@/stores/profileStore';
import { socket } from '@/socket';

import shatteringGif from '@/assets/Composition-1noloop.gif';

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
    ManaBar,
  },
  setup() {
    const attackLine = ref(null);

    let cardsEnemyRef = {};
    let cardPlayerRef = {};
    const setCardRef = (cardId) => (el) => {
      cardsEnemyRef[cardId] = el;
    };
    const setCardPlayerRef = (cardId) => (el) => {
      cardPlayerRef[cardId] = el;
    };

    const enemyRef = ref({});
    const playerRef = ref({});

    const gameStore = useGameStore();
    const profileStore = useProfileStore();
    const route = useRoute();
    const router = useRouter();

    const gameId = computed(() => gameStore.game.id);
    const isPlayerTurn = computed(() => gameStore.game.current_player === profileStore.getId);
    const turnStartedAt = computed(() => gameStore.game.turnStartedAt);
    // const playerMana = computed(() => gameStore.playerMana);
    // const opponentMana = computed(() => gameStore.opponentMana);

    const playerMana = computed(() => gameStore.game.first_player === profileStore.getId ? gameStore.game.first_player_current_mana : gameStore.game.second_player_current_mana);
    const opponentMana = computed(() => gameStore.game.first_player === profileStore.getId ? gameStore.game.second_player_current_mana : gameStore.game.first_player_current_mana);

    const hand = computed(() => gameStore.hand);
    const opponentCardsCount = computed(() => gameStore.opponentCardsCount);
    const myBoardCardInstances = computed(() => gameStore.myBoardCardInstances);
    const opponentBoardCardInstances = computed(() => gameStore.opponentBoardCardInstances);

    const avatarUrl = computed(() => profileStore.avatarUrl);

    const enemyId = computed(() => (gameStore.game.first_player === profileStore.getId) ? gameStore.game.second_player : gameStore.game.first_player);

    const enemyAvatar = computed(() => `${import.meta.env.VITE_API}/users/${enemyId.value}/avatar`);

    const myHp = computed(() => gameStore.game.first_player === profileStore.getId ? gameStore.game.first_player_hp : gameStore.game.second_player_hp);
    const enemyHp = computed(() => gameStore.game.first_player === profileStore.getId ? gameStore.game.second_player_hp : gameStore.game.first_player_hp);

    const isForfeitModalOpen = ref(false);
    const isWinnerModalOpen = ref(false);
    const isLooseModalOpen = ref(false);

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
      gameStore.getHand();
      gameStore.getOpponentCardsCount();
    }

    socket.on('game:forfeited', (game) => {
      gameStore.setGame(game);
      isForfeitModalOpen.value = true;
    });

    socket.on('game:attack:player', async (game, attackerId, isTargetDie) => {
      launchAttackAnimation(attackerId, undefined, true, isTargetDie);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      gameStore.setGame(game);
    });

    socket.on('game:attack:card', async (game, attackerId, targetedCardId, isTargetDie, isAttackerDie) => {
      launchAttackAnimation(attackerId, targetedCardId, false, isTargetDie, isAttackerDie);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      gameStore.setGame(game);
    });

    socket.on('game:win', (game, user) => {
      gameStore.setGame(game);
      user;
      isWinnerModalOpen.value = true;
      profileStore.setProfile(user);
    });

    socket.on('game:loose', (game) => {
      gameStore.setGame(game);
      isLooseModalOpen.value = true;
    });

    socket.on('game:player-hand', ({ cards }, game) => {
      gameStore.setHand(cards);
      gameStore.setGame(game);
    });

    socket.on('game:opponent-hand', (cardCount, game) => {
      gameStore.setOpponentCardCount(cardCount);
      gameStore.setGame(game);
    });

    const onAdd = (event) => {
      const cardId = event.item.__draggable_context.element.id;

      gameStore.placeCard(cardId);
      // gameStore.setGame(gameStore.game);
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
      sendAttack();
    };

    const attackPlayer = () => {
      if (!isPlayerTurn.value) return;
      if (!attack.attacker) return;
      attack.target = 'player';
      sendAttack();
    };

    const sendAttack = () => {
      if (!isPlayerTurn.value) return;
      // console.log('send attack', attack);
      if (attack.target === 'player') {
        gameStore.attackPlayer(attack.attacker);
      } else {
        gameStore.attackCard(attack.attacker, attack.target);
      }
      cancelAttack();
    };

    /**
     *
     * @param {number} attackerCardId id of the card that attack
     * @param {number} [targetedCardId] id of the card that is targeted
     * @param {boolean} isAPlayerAttack if attack target is the player
     * @param {boolean} isTagetDead if the target is dead
     */
    const launchAttackAnimation = (attackerCardId, targetedCardId, isAPlayerAttack = false, willTargetDied = false, willAttackerDied= false)  => {
      const getTargetedElement = (isAPlayerAttack) => {
        if (isAPlayerAttack) {
          return isPlayerTurn.value ? enemyRef.value.$el : playerRef.value.$el;
        }
        return isPlayerTurn.value ? cardsEnemyRef[targetedCardId].$el : cardPlayerRef[targetedCardId].$el;
      };

      let attackerCardElement = isPlayerTurn.value ? cardPlayerRef[attackerCardId].$el : cardsEnemyRef[attackerCardId].$el;
      let targetedElement = getTargetedElement(isAPlayerAttack);

      const distanceX = targetedElement.getBoundingClientRect().left - attackerCardElement.getBoundingClientRect().left;
      const distanceY = (targetedElement.getBoundingClientRect().top - attackerCardElement.getBoundingClientRect().top) + ((attackerCardElement.getBoundingClientRect().height) / 2)  ;

      const angle = Math.atan2(attackerCardElement.getBoundingClientRect().left - targetedElement.getBoundingClientRect().left, attackerCardElement.getBoundingClientRect().top - targetedElement.getBoundingClientRect().top);
      const rotation = angle * (180 / Math.PI) * -1;

      //TODO changer les valeurs pour la pov si l'enemi attaque & ajouter une class css pour inverser

      attackerCardElement.style.transition = '0.35s ease-out';
      attackerCardElement.style.transform = `translate(${distanceX}px, ${distanceY}px) rotate(${rotation}deg)`;
      attackerCardElement.children[0].classList.add('card_animation');

      if (willTargetDied) {
        // destroy target after 1500ms
        setTimeout(() => { // on envoie l'animation destroyCard à l'objet ciblée (currentTargeted)
          destroyCard(targetedCardId, isAPlayerAttack);
        }, 1500);
      }
      if (willAttackerDied) {
        // destroy attacker after 1500ms
        setTimeout(() => { // on envoie l'animation destroyCard à l'objet ciblée (currentTargeted)
          destroyCard(attackerCardId, isAPlayerAttack);
        }, 1500);
      }

      // reset attacker card after 1300ms
      setTimeout(() => {
        attackerCardElement.style.boxShadow = 'none';
        attackerCardElement.style.transform = 'translate(0, 0)';
        attackerCardElement.children[0].classList.remove('card_animation');
      }, 1300);

    };

    const destroyCard = (targetCardId, isAPlayerAttack = false) => {
      if (isPlayerTurn.value) { //if player is attacking, we destroy enemy card
        if (isAPlayerAttack) {
          enemyRef.value.$el.classList.add('breakCard');
          enemyRef.value.$el.style.maskImage = `url(${shatteringGif})`;
        } else {
          cardsEnemyRef[targetCardId].$el.children[0].classList.add('breakCard');
          cardsEnemyRef[targetCardId].$el.children[0].style.maskImage = `url(${shatteringGif})`;
        }
      } else { //if enemy is attacking, it destroy one of player card
        if (isAPlayerAttack) {
          playerRef.value.$el.classList.add('breakCard');
          playerRef.value.$el.style.maskImage = `url(${shatteringGif})`;
        } else {
          cardPlayerRef[targetCardId].$el.children[0].classList.add('breakCard');
          cardPlayerRef[targetCardId].$el.children[0].style.maskImage = `url(${shatteringGif})`;
        }
      }
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
      playerMana,
      opponentMana,
      hand,
      opponentCardsCount,
      destroyCard,
      enemyRef,
      playerRef,
      shatteringGif,
      isWinnerModalOpen,
      isLooseModalOpen,
      myBoardCardInstances,
      opponentBoardCardInstances,
    };
  },
};
</script>

<style lang="scss" scoped>
.breakCard{ //l'animation de la destruction de la carte, utilisé pour le player ici
  // -webkit-mask-image: url(http://localhost:8080/src/assets/Composition-1noloop.gif);
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

      &__card {
        &.cant-attack {
          cursor: not-allowed;
        }
      }
    }

    &__mana-bar {
      position: absolute;
      right: 0;
      z-index: 20;

      &--player {
        bottom: 0;
      }

      &--enemy {
        top: 0;
      }
    }
  }
}
</style>
