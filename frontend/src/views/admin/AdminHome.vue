<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Total Payments</span>
          <el-button
            class="button"
            text
          >
            go to payments
          </el-button>
        </div>
      </template>
      <div>
        {{ 'Total Value : ' + totalMoneySpent + ' €' }}
      </div>
      <div>
        {{ 'Total Coins bought : ' + totalCreditsPurchased }}
      </div>
      <div>
        {{ 'Best product : ' + o }}
      </div>
    </el-card>

    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Game stats</span>
        </div>
      </template>
      <div>
        {{ 'average game duration : ' + totalMoneySpent + ' €' }}
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { useStatStore } from '@/stores/statStore';
export default {
  name: 'AdminHome',
  setup() {


    const statStore = useStatStore();
    statStore.getTotalCreditsPurchased();
    statStore.getTotalMoneySpent();

    // const isStatsLoading = computed(() => statStore.isStatsLoading);
    const totalCreditsPurchased = computed(() => statStore.totalCreditsPurchased);
    const totalMoneySpent = computed(() => statStore.totalMoneySpent);








    return {
      totalCreditsPurchased,
      totalMoneySpent,
    };
  },
};
</script>

<style scoped>
.box-card {
  width: 480px;
}
</style>
