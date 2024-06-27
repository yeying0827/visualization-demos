<template>
  <h3>动画：HTML/CSS</h3>
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
  <div v-show="checkedTab === 1" style="position: relative;">
    <div class="increase-frame" ref="increaseRef"></div>
  </div>
  <!-- 时序动画 -->
  <div v-show="checkedTab === 2" style="position: relative;">
    <div class="increase-frame" ref="timeOrderRef"></div>
  </div>
  <!-- 标准动画模型 -->
  <div v-show="checkedTab === 3" class="container">
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
  </div>
  <!-- 缓动函数 -->
  <div v-show="checkedTab === 4" class="easing">
    <div class="block"></div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import {Animator} from "../../utils/animation-index.js";
import BesizerEasing from "bezier-easing";

const tabs = [
  {name: "固定帧动画"},
  {name: "非固定帧动画-增量动画"},
  {name: "非固定帧动画-时序动画"},
  {name: "时序动画-标准动画模型"},
  {name: "插值与缓动函数"},
];

const checkedTab = ref(4);
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
      const T = 2000;
      let startTime = null;
      function update() {
        startTime = startTime === null? Date.now() : startTime;
        const p = (Date.now() - startTime) / T;
        const angle = startAngle + p * 360;
        timeOrderRef.value.style.transform = `rotate(${angle}deg)`;
        requestAnimationFrame(update);
      }
      update();
      break;
    case 3:
      const blocks = document.querySelectorAll('.container .block');
      const animator = new Animator({duration: 1000, iterations: 1.5});
      (async function() {
        let i = 0;
        while(true) {
          await animator.animate(blocks[i++ % 4], ({target, timing}) => {
            target.style.transform = `rotate(${timing.p * 360}deg)`;
          });
        }
      }());
      break;
    case 4:
      const block = document.querySelector('.easing .block');
      const animator1 = new Animator({duration: 3000, easing: BesizerEasing(0.76, 0, 0.24, 1)});
      document.addEventListener('click', () => {
        animator1.animate({el: block, start: 100, end: 400}, ({target: {el, start, end}, timing: {p}}) => {
          const left = start * (1 - p) + end * p;
          el.style.left = `${left}px`;
        });
      })
      break;
  }
}
</script>

<style lang="less" scoped>
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
/*标准动画模型*/
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 300px;
  .block {
    width: 100px;
    height: 100px;
    margin: 20px;
    flex-shrink: 0;
    transform-origin: 50% 50%;
    &:nth-child(1) {background-color: red;}
    &:nth-child(2) {background-color: blue;}
    &:nth-child(3) {background-color: green;}
    &:nth-child(4) {background-color: orange;}
  }
}
/*缓动函数*/
.easing {
  .block {
    position: relative;
    left: 100px;
    width: 100px;
    height: 100px;
    margin: 20px;
    flex-shrink: 0;
    background-color: blue;
  }
}
</style>
