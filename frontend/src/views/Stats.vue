<template>
  <div class="stats">
    <container class="stats__container">
      <h2>Cards count</h2>
      <h3>{{ cardCount ?? "no cards" }}</h3>
      <h2>Cards count by type</h2>
      <v-chart
        class="chart"
        :option="option"
        autoresize
      />
    </container>
    <container class="stats__container">
      <h2>Pack opened</h2>
      <h3>{{ totalPackOpen ?? "no pack opened" }}</h3>
      <h2>Pack opened by day</h2>
      <v-chart
        class="chart"
        :option="optionChart"
        autoresize
      />
    </container>
  </div>

  <container class="stats__container solo_stat">
    <h2>Total players XP</h2>
    <h3>{{ totalXp ?? "no xp" }}</h3>
  </container>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import Container from '@/components/Container.vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,

} from 'echarts/components';
import VChart from 'vue-echarts';
import { useStatStore } from '@/stores/statStore';

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  LineChart,
]);


const option = ref({
  title: {
    text: 'Card types',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  series: [
    {
      name: 'Card types',
      type: 'pie',
      radius: '55%',
      center: [ '50%', '60%' ],
      label: {
        position: 'inner',
        fontSize: 17,
      },
      data: [ { name: 'no type', value: 0 } ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
});


const optionChart = ref({
  title: {
    text: 'Pack opened by day',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{c} openings',
  },
  xAxis :
    {
      type: 'category',
      data : [],
      axisLabel: {
        show: true,
        formatter (value) {
          const date = new Date(parseInt(value));
          return date.toLocaleDateString();
        },
        fontSize: 17,
      },

    },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Pack opened',
      type: 'line',
      radius: '55%',
      center: [ '50%', '60%' ],
      label: {
        position: 'inner',
        fontSize: 17,
      },
      data : [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
});


export default {
  name: 'StatsView',
  components: {
    Container,
    VChart,
  },
  setup() {
    const isGetStatsLoading = ref(false);
    const statStore = useStatStore();

    const cardCount = computed(() => statStore.cardsCount);
    statStore.getCardsCount();
    const cardCountByType = computed(() => statStore.cardsCountByType);
    statStore.getCardsCountByType();
    const totalPackOpen = computed(() => statStore.totalPackOpen);
    statStore.getTotalPackOpen();
    const packOpenedByDay = computed(() => statStore.numberOfPackOpenByDay);
    const totalXp = computed(() => statStore.totalXp);
    statStore.getTotalXp();

    cardCountByType.value.forEach((cardType) => {
      option.value.series[0].data.push({
        name: cardType._id ?? 'no type',
        value: cardType.count,
      });
    });

    onMounted(() => {
      option.value.series[0].data = [];
      statStore.getCardsCount().then(() => {
        cardCountByType.value.forEach((cardType) => {
          option.value.series[0].data.push({
            name: cardType._id ?? 'no type',
            value: cardType.count,
          });
        });
        // isGetStatsLoading.value = false;
      });

      optionChart.value.series[0].data = [];
      statStore.getNumberOfPackOpenByDay().then(() => {
        packOpenedByDay.value.forEach((pack) => {
          optionChart.value.xAxis.data.push(
            pack._id,
          );
          optionChart.value.series[0].data.push(
            pack.packOpened,
          );
        });
        // isGetStatsLoading.value = false;
      });

    });

    return {
      option,
      optionChart,
      isGetStatsLoading,
      cardCount,
      totalPackOpen,
      totalXp,
    };
  },
};
</script>


<style scoped>
.chart {
  height: 40vh;
  width: 40vw;
  /* margin: 0 auto; */
}

.solo_stat {
  margin: 10vh auto;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  /* margin: 0 auto; */
  /* width: 100%; */
}
</style>
