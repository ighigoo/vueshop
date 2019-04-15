<template>
  <div>
    <div class="turntable">
      <div
        class="turntable__table"
        :class="{'turntable__table--turning': isRunning}"
        id="turntable"
        ref="turntable"
      >
        <div class="turntable__bg">
          <div class="turntable__bg-block"></div>
          <div class="turntable__bg-block"></div>
          <div class="turntable__bg-block"></div>
        </div>
        <ul class="turntable__list" id="turntable_list">
          <li class="turntable__coupon">
            <span class="turntable__text">1</span>
          </li>
          <li class="turntable__coupon">
            <span class="turntable__text">2</span>
          </li>
          <li class="turntable__coupon">
            <span class="turntable__text">3</span>
          </li>
        </ul>
      </div>
      <div class="pointer disabled" id="turntable_pointer" @click.prevent="startTurning">
        <div class="pointer__triangle"></div>
        <div class="pointer__circle">
          <span class="pointer__text">抽獎</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      coupons: [
        {
          id: "", // 優惠券ID
          percent: 100, // 折價百分比
          title: "", // 優惠券名稱
          //中獎範圍(角度)
          degrees: {
            from: 0,
            to: 0
          }
        }
      ],
      // 每個優惠券所占角度( 360 / coupons.length )
      degreePerCoupon: 0,
      turnTable: {
        nowDegree: 0,
        targetDeg: 3690
      },

      isRunning: false
    };
  },
  methods: {
    startTurning() {
      const vm = this;

      vm.isRunning = true;
      vm.updateTurntableStatus();
      vm.turnTable.nowDegree = vm.turnTable.targetDeg;
      setTimeout(() => {
        vm.updateTurntableStatus();
        vm.isRunning = false;
      }, 2000);
    },
    updateTurntableStatus() {
      const vm = this;
      document.documentElement.style.setProperty(
        "--targetDeg",
        `${vm.turnTable.targetDeg}deg`
      );
      document.documentElement.style.setProperty(
        "--nowDeg",
        `${vm.turnTable.nowDegree}deg`
      );
    }
  },
  create() {
    this.updateTurntableStatus();
  }
};
</script>

<style lang="scss">
@import "~bootstrap/scss/functions";
@import "../assets/helpers/variables";
//#e4c6d0

//轉盤變數
$targetDeg: var(--targetDeg);
$nowDeg: var(--nowDeg);
$tempDeg: 50deg;

@keyframes turnTable {
  0% {
    transform: rotate($nowDeg);
  }
  100% {
    transform: rotate($targetDeg);
  }
}

.turntable {
  position: relative;
  top: 0;
  left: 0;
  overflow: hidden;
  margin: 50px;
  width: 20rem;
  height: 20rem;
  border: 7px solid $blue;
  border-radius: 50%;
  box-shadow: 0 0 20px #b2a98d;

  &__table {
    position: absolute;
    top: -7px;
    left: -7px;
    background-color: aqua;
    width: 20rem;
    height: 20rem;
    transform: rotate($nowDeg);
    &--turning {
      animation: turnTable 2s cubic-bezier(0.08, 0.67, 0.61, 0.96);
    }
  }
  &__list,
  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    // background-color: yellow;
    width: 100%;
    height: 100%;
  }
  &__list {
    transform: rotate(45deg);
    z-index: 2;
  }
  &__bg {
    transform: rotate(30deg);
    z-index: 1;
  }
  &__coupon {
    position: absolute;
    top: 0;
    left: 0;
    // background-color: green;
    width: 50%;
    height: 50%;
    transform-origin: right bottom;
    display: flex;
    justify-content: center;
    align-items: center;
    &:nth-child(1) {
      transform: rotate(0deg);
    }
    &:nth-child(2) {
      transform: rotate(120deg);
    }
    &:nth-child(3) {
      transform: rotate(240deg);
    }
  }
  &__bg-block {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    transform-origin: bottom;
    overflow: hidden;
    &:nth-child(1) {
      background-color: green;
      transform: rotate(-45deg);
      z-index: 1;
    }
    &:nth-child(2) {
      background-color: blue;
      transform: rotate(120deg);
      z-index: 1;
    }
    &:nth-child(3) {
      background-color: yellow;
      transform: rotate(240deg);
      z-index: 1;
    }
  }
  &__bg-block:last-child:before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: green;
    transform-origin: bottom;
  }
  &__bg-block:before {
    z-index: 1;
    transform: rotate(120deg);
  }

  &__text {
    transform: rotate(-45deg);
  }
}
.pointer {
  &__circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 4.5rem;
    height: 4.5rem;
    border: 10px solid orangered;
    border-radius: 50%;
    background-color: #ffffff;
    color: #000000;
    clip-path: circle(50% at 50% 50%);
    z-index: 2;
    cursor: pointer;
  }
  &__triangle {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    width: 3.5rem;
    height: 2.5rem;
    background-color: orangered;
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    z-index: 1;
  }
  &__text {
    border-radius: 50%;
  }
}
</style>
