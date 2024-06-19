<template>
  <h3>动画的三种形式</h3>
  <div>
    <span
        class="filter-type"
        :class="{active: checkedTab === index}"
        @click="checkedTab = index"
        v-for="(item, index) in tabs">{{ item.name }}</span>
  </div>
  <!-- 固定帧动画 -->
  <div v-show="checkedTab === 0" style="position: relative;">
    <div class="fixed-frame"></div>
  </div>
  <!-- 增量动画 -->
  <div v-show="checkedTab === 1" style="position: relative;/* background-color: yellow; width: 300px; height: 300px;*/">
    <div class="increase-frame" ref="increaseRef"></div>
  </div>
  <!-- 时序动画 -->
  <div v-show="checkedTab === 2" style="position: relative;">
    <div class="increase-frame" ref="timeOrderRef"></div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";

const tabs = [
  {name: "固定帧动画"},
  {name: "非固定帧动画-增量动画"},
  {name: "非固定帧动画-时序动画"},
];

const checkedTab = ref(2);
const increaseRef = ref(null);
const timeOrderRef  =ref(null);

onMounted(() => {
  drawByTab(checkedTab.value);

  watch(checkedTab, () => {
    drawByTab(checkedTab.value);
  });
});

const drawByTab = type => {
  switch (type) {
    case 0:
      break;
    case 1:
      let rotation = 0;
      requestAnimationFrame(function update() {
        increaseRef.value.style.transform = `rotate(${rotation ++}deg)`;
        requestAnimationFrame(update);
      });
      break;
    case 2:
      const startAngle = 0;
      const T = 2000; // 周期。旋转这一周的时间
      let startTime = null;
      function update() {
        startTime = startTime === null ? Date.now() : startTime;
        const p = (Date.now() - startTime) / T;
        const angle = startAngle + p * 360;
        timeOrderRef.value.style.transform = `rotate(${angle}deg)`;
        requestAnimationFrame(update);
      }
      update();
      break;
  }
}
</script>

<style scoped>
.filter-type {
  display: inline-block;
  padding: 4px 10px;
  background-color: #646cff;
  color: #fff;
  cursor: pointer;
}
.filter-type.active {
  background-color: #4b52fc;
}
.filter-type + .filter-type {
  margin-left: 5px;
}
/*固定帧动画*/
.fixed-frame {
  position: absolute;
  left: 100px;
  top: 100px;
  width: 86px;
  height: 60px;
  zoom: 0.5;
  background-repeat: no-repeat;
  background-image: url("@/assets/bird.png");
  background-position: -178px -2px;
  animation: flappy .5s step-end infinite;
}
@keyframes flappy {
  0%  {background-position: -178px -2px;}
  33% {background-position: -90px -2px;}
  66% {background-position: -2px -2px;}
}
/*增量动画*/
.increase-frame {
  position: absolute;
  left: 100px;
  top: 100px;
  width: 100px;
  height: 100px;
  background-color: blue;
  transform-origin: 50% 50%;
}
</style>
