<template>
  <h3>课后练习</h3>
  <p>{{height}}</p>
  <div class="container">
    <div class="block" ref="ballRef"></div>
  </div>
</template>

<script setup>
import {Animator} from "../../utils/animation.js";
import {onMounted ,ref} from "vue";

const ballRef = ref(null);
const height = ref(200);
onMounted(() => {
  let duration = 1000;
  let k = 0.5;
  const ball = ballRef.value;
  document.addEventListener('click', () => {
    height.value = 200;
    duration = 1000;

    (async function () {
      while(duration > 16) { // 当 nextDuration 小于16（60fps 的帧间隔是16.666…）时停止弹起
        console.log(duration);
        // 落下：匀加速
        const animator_down = new Animator({duration, easing: p => p ** 2});
        await animator_down.animate({el: ball, start: height.value, end: 0}, ({target: {el, start, end}, timing: {p}}) => {
          const bottom = start * (1 - p) + end * p;
          el.style.bottom = `${bottom}px`;
        });
        height.value = Math.floor(height.value * k);
        // 弹起：匀减速
        const animator_up = new Animator({duration, easing: p => p * (2 - p)});
        await animator_up.animate({el: ball, start: 0, end: height.value}, ({target: {el, start, end}, timing: {p}}) => {
          const bottom = start * (1 - p) + end * p;
          el.style.bottom = `${bottom}px`;
        });
        duration = (duration ** 2 * k) ** 0.5;
      }
    }());
  });
});
</script>

<style scoped>
.container {
  position: relative;
  height: 300px;
  background-color: #ffffec;
}
.block {
  position: absolute;
  left: 50%;
  bottom: 200px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-image: conic-gradient(#1473e6, #247b5e);
}
</style>
