<template>
  <div class="game-history">
    <h1>Game History</h1>
    <div class="nes-table-responsive">
      <div v-if="!isGameHistoryLoading && gameHistory.length === 0">
        <p>Your game history is empty</p>
      </div>
      <div v-else-if="!isGameHistoryLoading">
        <table class="nes-table is-bordered is-centered">
          <thead>
            <tr>
              <th>Game ID</th>
              <th>Winner</th>
              <th>Loser</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="game in gameHistory"
              :key="game.id"
            >
              <td>{{ game.id }}</td>
              <td>{{ game.first_player === game.winner ? game.firstPlayer.firstname : game.secondPlayer.firstname }}   <i class="nes-icon trophy is-small" /></td>
              <td>{{ game.first_player === game.winner ? game.secondPlayer.firstname : game.firstPlayer.firstname }}  <i class="nes-icon close is-small" /></td>
              <td>{{ new Date(game.endedAt).toLocaleString() }}</td>
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

    const isGameHistoryLoading = computed(() => profileStore.isGameHistoryLoading);
    const gameHistory = computed(() => profileStore.gameHistory);

    return {
      isGameHistoryLoading,
      gameHistory,
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
</style>
