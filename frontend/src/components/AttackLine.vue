<template>
  <div
    v-show="isDrawing"
    ref="line"
    class="line"
    :class="{
      'line--is-valid': isValid,
    }"
    @mousemove="drawLine"
  />
</template>

<script>
import { computed, reactive, ref, toRefs } from 'vue';

export default {
  name: 'AttackLine',
  props: {
    attack: {
      type: Number,
      default: 0,
    },
    hoveringType: {
      type: String,
      validator: (value) => [
        'player',
        'card',
        'empty',
      ].includes(value),
      default: 'empty',
    },
    isBoardEmpty: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { attack, isBoardEmpty, hoveringType } = toRefs(props);
    const line = ref(null);
    const isDrawing = ref(false);
    let startPoint = reactive({
      x: 0,
      y: 0,
    });
    let endPoint = reactive({
      x: 0,
      y: 0,
    });
    const deltaX = computed(() => endPoint.x - startPoint.x);
    const deltaY = computed(() => endPoint.y - startPoint.y);
    const length = computed(() => Math.sqrt(deltaX.value * deltaX.value + deltaY.value * deltaY.value));
    const isValid = computed(() => {
      if (hoveringType.value === 'player' && isBoardEmpty.value) {
        return true;
      }
      if (hoveringType.value === 'card') {
        return true;
      }
      return false;
    });
    const text = computed(() => {
      if (isValid.value) {
        return `"${attack.value} damage"`;
      }
      if (hoveringType.value === 'player') {
        return '"Kill card on board first"';
      }
      return '"Not a valid target"';
    });
    // To keep the text horizontal
    const transform = computed(() => {
      const angle = Math.atan2(deltaY.value, deltaX.value);
      return `rotate(${-angle}rad)`;
    });

    const startDrawing = (event) => {
      isDrawing.value = true;
      startPoint.x = event.clientX;
      startPoint.y = event.clientY;
      endPoint.x = event.clientX;
      endPoint.y = event.clientY;
      drawLine(event);
    };

    const drawLine = (event) => {
      if (!isDrawing.value) return;
      endPoint.x = event.clientX;
      endPoint.y = event.clientY;

      line.value.style.width = `${length.value - 1}px`;
      line.value.style.transform = `rotate(${Math.atan2(deltaY.value, deltaX.value)}rad)`;
      line.value.style.top = `${startPoint.y}px`;
      line.value.style.left = `${startPoint.x}px`;
    };

    const stopDrawing = () => {
      isDrawing.value = false;
    };

    const resetLine = () => {
      if (line.value) stopDrawing();
      line.value.style.width = '1px';
      line.value.style.transform = 'rotate(0rad)';
      line.value.style.top = '0px';
      line.value.style.left = '0px';
    };

    return {
      startDrawing,
      drawLine,
      stopDrawing,
      resetLine,
      line,
      isDrawing,
      text,
      transform,
      isValid,
    };
  },
};
</script>

<style scoped lang="scss">
.line {
  z-index: 8000;
  position: fixed;
  background-color: red;
  height: 15px;
  width: 1px;
  transform-origin: left center;

  &::after {
    content: v-bind(text);
    position: absolute;
    top: -7px;
    right: 0px;
    font-size: 12px;
    color: white;
    background-color: red;
    transform: v-bind(transform);
    padding: 5px;
  }

  &--is-valid {
    background-color: green;
    opacity: 1;

    &::after {
      background-color: green;
    }
  }
}
</style>
