<template>
  <div class="game">
    <container
      class="game__container"
      :is-rounded="true"
    >
      <div v-if="isGameLoading">
        <h2>Crushing the Bridge of Khazad-dûm ...</h2>
      </div>
      <div v-else-if="!isGameFound">
        <h2>Game not found</h2>
      </div>
      <div v-else>
        <game-id
          v-if="actualGame.id"
          :id="actualGame.id"
        />
        <ul>
          <li v-if="iAmGameOwner">
            {{ profile.firstname }} (you)
          </li>
          <li v-else>
            {{ actualGame.firstPlayer?.firstname }}
          </li>
          <li v-if="actualGame.second_player === profile.id">
            {{ profile.firstname }} (you)
          </li>
          <li v-else-if="actualGame.secondPlayer">
            {{ actualGame.secondPlayer?.firstname }}
          </li>
          <li v-else>
            Waiting for a second player ...
          </li>
        </ul>
        <p
          v-if="hasStartError"
          class="game__container__error nes-text is-error"
        >
          {{ startErrorMessage }}
        </p>
        <div
          v-if="decks.length > 0"
          class="game__container__choose-deck"
        >
          <span class="game__container__choose-deck__label">Choose deck:</span>
          <div class="nes-select">
            <select
              id="select-fav-deck"
              required
              @change="selectFavDeck"
            >
              <option
                v-if="idDeckFav === null"
                value=""
                selected
              >
                Aucun
              </option>
              <option
                v-else
                value=""
                hidden
                disabled
              >
                Aucun
              </option>
              <template
                v-for="deck in decks"
                :key="deck.id"
              >
                <option
                  v-if="deck.id === idDeckFav"
                  selected
                  :value="deck.id"
                >
                  {{ deck.name }}
                </option>
                <option
                  v-else
                  :value="deck.id"
                >
                  {{ deck.name }}
                </option>
              </template>
            </select>
          </div>
        </div>
        <div
          v-else
          class="game__container__choose-deck nes-text is-error"
        >
          <p>You don't have any valid decks, please create one and come back.</p>
        </div>
        <div class="game__container__buttons">
          <button
            v-if="iAmGameOwner"
            type="button"
            class="nes-btn"
            :class="{
              'is-disabled': !actualGame.second_player || decks.length === 0,
              'is-primary': actualGame.second_player && decks.length > 0,
            }"
            @click="startGame"
          >
            Start game
          </button>
        </div>
      </div>
    </container>
    <pop-up
      v-model:isOpen="isGameCanceled"
      @close="goToHome"
    >
      <template #header>
        <h2>The game has been canceled</h2>
      </template>
      <p>The game has been canceled by {{ actualGame.firstPlayer?.firstname }}.</p>
      <p>You will be redirected to the home page.</p>
      <template #confirm>
        <span>Ok :(</span>
      </template>
    </pop-up>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import Container from '@/components/Container.vue';
import PopUp from '@/components/PopUp.vue';
import GameId from '@/components/games/GameId.vue';

import { useGameStore } from '@/stores/gameStore';
import { useProfileStore } from '@/stores/profileStore';
import { useDeckStore } from '@/stores/deckStore';
import { socket } from '@/socket';

export default {
  name: 'GameView',
  components: {
    GameId,
    Container,
    PopUp,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const gameStore = useGameStore();
    const profileStore = useProfileStore();
    const deckStore = useDeckStore();

    const actualGame = computed(() => gameStore.game);
    const isGameLoading = computed(() => gameStore.isGameLoading);
    const isGameLeft = computed(() => gameStore.isGameLeft);
    const iAmGameOwner = computed(() => gameStore.iAmGameOwner);
    const idDeckFav = computed(() => profileStore.profile.idDeckFav);
    const decks = computed(() => deckStore.validDecks);

    const profile = computed(() => profileStore.profile);

    const isGameFound = ref(true);
    const isGameCanceled = ref(false);
    const hasStartError = ref(false);
    const startErrorMessage = ref('');

    const getValidDecks = () => {
      deckStore.getValidDecks();
    };

    getValidDecks();

    const goToHome = () => {
      gameStore.$reset();
      router.push({ name: 'home' });
    };

    socket.on('game:joined', (game) => {
      gameStore.setGame(game);
    });

    socket.on('game:leaved', (game) => {
      gameStore.setGame(game);
    });

    socket.once('game:started', async (game, { cards }, opponentCardCount) => {
      gameStore.setGame(game);
      gameStore.setHand(cards);
      gameStore.setOpponentCardCount(opponentCardCount);
      router.push({ name: 'game', params: { id: game.id } });
    });

    socket.on('game:removed', () => {
      if (iAmGameOwner.value) {
        goToHome();
      } else {
        isGameCanceled.value = true;
      }
    });

    const startGame = async () => {
      hasStartError.value = false;
      try {
        await gameStore.start();
      } catch (error) {
        console.error('Error while starting game');
        console.error(error);
        hasStartError.value = true;
        startErrorMessage.value = error.data.reason;
      }
    };

    const selectFavDeck = (event) => {
      if (event.target.value !== '') {
        profileStore.updateDeckFav(event.target.value);
      }
    };

    const getGame = async () => {
      isGameFound.value = false;
      try {
        await gameStore.getGame(route.params.id);
        isGameFound.value = true;
      } catch (error) {
        isGameFound.value = false;
      }
    };

    if (route.params.id) {
      getGame();
    } else {
      router.push({ path: '/' });
    }

    return {
      actualGame,
      decks,
      getValidDecks,
      goToHome,
      iAmGameOwner,
      idDeckFav,
      isGameCanceled,
      isGameFound,
      isGameLeft,
      isGameLoading,
      profile,
      selectFavDeck,
      startGame,
      hasStartError,
      startErrorMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
.game {
  width: 100%;
  height: 100%;

  &__container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &__choose-deck{
      margin-top: 2rem;
      margin-bottom: 2rem;
    }

    &__buttons {
      display: flex;
      gap: 1rem;
    }
  }
}
</style>
