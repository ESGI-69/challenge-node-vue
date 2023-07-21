<template>
  <div class="player-avatar">
    <div :class="isEnemy ? 'circle circle__enemy' : 'circle'">
      <div class="circle__inner">
        <div class="circle__inner__text">
          1
        </div>
      </div>
    </div>

    <img
      :src="userAvatar"
      alt="User Avatar"
    >
  </div>
</template>

<script>
export default {
  name: 'PlayerAvatar',
  props: {
    userAvatar: {
      type: String,
      required: true,
    },
    isEnemy: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    return {};
  },
};
</script>

<style scoped>
.player-avatar {
    width: 200px;
    height: 200px;
    border-radius: 3%;
    /* overflow: hidden; */
    position: absolute;
    left: 0px;
    bottom: 0px;
    border: 4px solid black;
}

.player-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar__container__enemy{
    position: absolute;
    top: 0;
    /* transform: rotate(180deg); */
}
.circle {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: red;
    display: flex;
    justify-content: center;
    align-items: center;

}

.circle__enemy {
    top: initial;
    bottom: -10px;
}
</style>
