<template>
  <h3>标准动画模型</h3>
  <div class="container">
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
  </div>
</template>

<script setup>
import {onMounted} from "vue";
import {Animator} from "../../utils/animation.js";

onMounted(() => {
  const blocks = document.querySelectorAll('.block');
  const animator = new Animator({duration: 1000, iterations: 1.5});
  (async function() {
    let i = 0;
    while(true) {
      await animator.animate(blocks[i++ % 4], ({target, timing}) => {
        target.style.transform = `rotate(${timing.p * 360}deg)`;
      });
    }
  }());
})
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 300px;
}
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
</style>
