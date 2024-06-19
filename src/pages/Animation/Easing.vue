<template>
  <h3>插值与缓动函数</h3>
  <div>
    <span
        class="filter-type"
        :class="{active: checkedTab === index}"
        @click="checkedTab = index"
        v-for="(item, index) in tabs">{{ item.name }}</span>
  </div>
  <div style="position: relative;">
    <div class="block" :class="{'animate': checkedTab === 5}"></div>
  </div>
</template>

<script setup>
import {Animator} from "../../utils/animation.js";
import {onMounted, ref} from "vue";
import BesizerEasing from 'bezier-easing';

const tabs = [
  {name: "匀速"},
  {name: "初速度为0的匀加速"},
  {name: "末速度为0的匀减速"},
  {name: "使用缓动函数"},
  {name: "贝塞尔缓动函数"},
  {name: "CSS3:贝塞尔缓动函数"},
];

const checkedTab = ref(0);

onMounted(() => {
  const block = document.querySelector('.block');
  const animator = new Animator({duration: 3000});
  const animator2 = new Animator({duration: 3000, easing: p => p ** 2});
  const animator3 = new Animator({duration: 3000, easing: BesizerEasing(0.5, -1.5, 0.5, 2.5)});
  document.addEventListener('click', () => {
    if (checkedTab.value <= 2) {
      animator.animate({el: block, start: 100, end: 400}, ({target: {el, start, end}, timing: {p}}) => {
        // 匀速变化 p = p;
        // 初速度为0的匀加速运动
        if(checkedTab.value === 1) p = p ** 2;
        // 末速度为0的匀减速运动
        if(checkedTab.value === 2) p = p * (2 - p);
        const left = start * (1 - p) + end * p;
        el.style.left = `${left}px`;
      });
    } else if (checkedTab.value === 3){
      animator2.animate({el: block, start: 100, end: 400}, ({target: {el, start, end}, timing: {p}}) => {
        const left = start * (1 - p) + end * p;
        el.style.left = `${left}px`;
      });
    } else if (checkedTab.value === 4) {
      animator3.animate({el: block, start: 100, end: 400}, ({target: {el, start, end}, timing: {p}}) => {
        const left = start * (1 - p) + end * p;
        el.style.left = `${left}px`;
      });
    }
  });
});
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

.block {
  position: relative;
  left: 100px;
  width: 100px;
  height: 100px;
  margin: 20px;
  flex-shrink: 0;
  background-color: red;
}

.animate {
  /*animation: mymove 3s cubic-bezier(0.5, -1.5, 0.5, 2.5) forwards;*/
  animation: mymove 3s cubic-bezier(0.83, 0, 0.17, 1) forwards;
}
@keyframes mymove {
  from {left: 100px;}
  to {left: 400px;}
}
</style>
