<template>
  <div class="turn-bar">
    <progress
      class="turn-bar__progress nes-progress"
      :class="{
        'is-success': isPlayerTurn && timeRemaningPercent > 50,
        'is-warning': isPlayerTurn && timeRemaningPercent <= 50 && timeRemaningPercent > 25,
        'is-error': isPlayerTurn && timeRemaningPercent <= 25,
      }"
      :value="timeRemaningPercent"
      max="100"
    />
    <button
      class="turn-bar__button nes-btn"
      :class="{
        'is-disabled': !isPlayerTurn,
        'is-primary': isPlayerTurn,
      }"
      @click="endTurn"
    >
      {{ isPlayerTurn ? 'End turn' : 'Opponent' }}
    </button>
  </div>
</template>

<script>
import { computed, ref, toRefs } from 'vue';

export default {
  name: 'TurnBar',
  props: {
    isPlayerTurn: {
      type: Boolean,
      required: true,
    },
    turnStartedAt: {
      type: String,
      required: true,
    },
    turnDuration: {
      type: Number,
      required: true,
    },
  },
  emits: [ 'end-turn' ],
  setup(props, { emit }) {
    const { turnStartedAt } = toRefs(props);

    const endTurn = () => {
      emit('end-turn');
    };

    const timeRemaningPercent = ref(40);
    const timeRemaningSeconds = ref('"0s');
    const turnStartedAtDate = computed(() => new Date(turnStartedAt.value));

    const calculateTimeRemaning = () => {
      const now = new Date();
      const timeRemaning = props.turnDuration - (now - turnStartedAtDate.value) / 1000;
      timeRemaningPercent.value = timeRemaning / props.turnDuration * 100;
      timeRemaningSeconds.value = `"${Math.round(timeRemaning)}s"`;
    };

    calculateTimeRemaning();
    setInterval(calculateTimeRemaning, 100);

    return {
      endTurn,
      timeRemaningPercent,
      timeRemaningSeconds,
    };
  },
};
</script>

<style scoped lang="scss">
.turn-bar {
  width: 100%;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto;
  column-gap: 1rem;

  &__progress {
    width: 100%;
    transform: rotate(180deg);

    &::after {
      content: v-bind(timeRemaningSeconds);
      position: absolute;
      left: 50%;
      top: 50%;
      background-color: white;
      transform: rotate(180deg) translateX(50%) translateY(50%);
      padding: 0.10rem 0.25rem;
    }
  }
}
</style>
