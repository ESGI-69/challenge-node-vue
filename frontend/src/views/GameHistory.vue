<template>
  <div class="game-history">
    <h1>  <i class="nes-icon trophy is-large" /> Game History   <i class="nes-icon trophy is-large" /></h1>
    <div class="nes-table-responsive">
      <div v-if="!isGameHistoryLoading && gameHistory.length === 0">
        <section class="message-list">
          <div class="chat">
            <span class="gorilla">🦍</span>
            <p class="nes-balloon from-left nes-pointer">
              Your game history is empty
            </p>
          </div>
        </section>
      </div>
      <div v-else-if="!isGameHistoryLoading">
        <table class="nes-table is-bordered is-centered">
          <thead>
            <tr>
              <th>Game ID</th>
              <th>Winner</th>
              <th>Loser</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="game in gameHistory"
              :key="game.id"
              :class="{ win: profileId === game.winner, lose: profileId !== game.winner }"
            >
              <td>{{ game.id }}</td>
              <td>{{ game.first_player === game.winner ? game.firstPlayer.firstname : game.secondPlayer.firstname }}   <i class="nes-icon trophy is-small" /></td>
              <td>{{ game.first_player === game.winner ? game.secondPlayer.firstname : game.firstPlayer.firstname }}  <i class="nes-icon close is-small" /></td>
              <td>{{ game.endType }}</td>
              <td>{{ new Date(game.endedAt).toLocaleString() }}</td>
              <td>{{ getDurationFromDates(game.startedAt, game.endedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

import { useProfileStore } from '@/stores/profileStore';

export default {
  name: 'GameHistoryView',
  setup() {
    const profileStore = useProfileStore();

    profileStore.getGameHistory();

    const profileId = computed(() => profileStore.getId);
    const isGameHistoryLoading = computed(() => profileStore.isGameHistoryLoading);
    const gameHistory = computed(() => profileStore.gameHistory);

    const getDurationFromDates = (startedAt, endedAt) => {
      const durationInSeconds = (new Date(endedAt) - new Date(startedAt)) / 1000;
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = (durationInSeconds % 60).toFixed(0);
      return `${minutes}min${seconds}s`;
    };

    return {
      isGameHistoryLoading,
      gameHistory,
      getDurationFromDates,
      profileId,
    };
  },
};
</script>

<style scoped>
.game-history {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.win{
  background-color: #a1a1f4;
}
.lose{
  background-color: #f7b0a1;
}
.gorilla{
  font-size: 10rem;
}
.chat{
  display: flex;
  align-items: center;
}
</style>
