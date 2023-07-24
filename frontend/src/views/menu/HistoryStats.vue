<template>
  <div class="history-stats">
    <router-link
      :to="{ name: 'game-history' }"
      class="nes-btn"
    >
      Game History
    </router-link>
    <router-link
      :to="{ name: 'payments-history' }"
      class="nes-btn"
    >
      Payment History
    </router-link>
    <router-link
      :to="{ name: 'stats' }"
      class="nes-btn"
    >
      Statistics
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'HistoryStatsView',
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.history-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  width: 100%;
}
</style>
