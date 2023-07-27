<template>
  <el-row
    :gutter="20"
    justify="space-evenly"
  >
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span><b>Total Payments</b></span>
          <router-link
            to="/admin/payments"
          >
            <el-button
              class="button"
              text
            >
              go to payments
            </el-button>
          </router-link>
        </div>
      </template>
      <div>
        {{ 'Total Value : ' + totalMoneySpent + ' €' }}
      </div>
      <div>
        {{ 'Total Coins bought : ' + totalCreditsPurchased }}
      </div>
      <div>
        {{ 'Best product : ' + bestProduct?.bestSellerProduct?.name }}
      </div>
    </el-card>

    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span><b>Game stats</b></span>
        </div>
      </template>
      <div>
        {{ 'Average game duration : ' + (averageGameDuration/1000).toFixed(0) + ' seconds' }}
      </div>
      <div>
        {{ 'Best player : ' + bestPlayer?.bestPlayer?.firstname + " " + bestPlayer?.bestPlayer?.lastname }}
      </div>
      <div>
        {{ 'Number of current games : ' + (numbersOfCurrentGames ?? 0) }}
      </div>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span><b>Users</b></span>
          <router-link
            to="/admin/users"
          >
            <el-button
              class="button"
              text
            >
              go to users
            </el-button>
          </router-link>
        </div>
      </template>
      <div>
        {{ 'Total users : ' + totalUsers }}
      </div>
    </el-card>
  </el-row>
</template>

<script>
import { computed } from 'vue';
import { useStatStore } from '@/stores/statStore';
export default {
  name: 'AdminHome',
  setup() {


    const statStore = useStatStore();
    statStore.getTotalCreditsPurchased();
    statStore.getTotalMoneySpent();
    statStore.getBestProduct();
    statStore.getAverageGameDuration();
    statStore.getBestPlayer();
    statStore.getTotalNumbersOfCurrentGames();
    statStore.getTotalUsers();


    // const isStatsLoading = computed(() => statStore.isStatsLoading);
    const totalCreditsPurchased = computed(() => statStore.totalCreditsPurchased);
    const totalMoneySpent = computed(() => statStore.totalMoneySpent);
    const bestProduct = computed(() => statStore.bestSellerProduct);
    const averageGameDuration = computed(() => statStore.averageGameDuration);
    const bestPlayer = computed(() => statStore.bestPlayer);
    const numbersOfCurrentGames = computed(() => statStore.numberOfCurrentGames);
    const totalUsers = computed(() => statStore.totalUsers);



    return {
      totalCreditsPurchased,
      totalMoneySpent,
      bestProduct,
      averageGameDuration,
      bestPlayer,
      numbersOfCurrentGames,
      totalUsers,
    };
  },
};
</script>

<style scoped>
.box-card {
  width: 480px;
}
</style>
