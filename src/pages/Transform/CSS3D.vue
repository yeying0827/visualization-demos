<template>
  <h3>CSS仿射变换 - Matrix 3d</h3>
  <p>参考资料：<a href="https://mp.weixin.qq.com/s/-aZ3tUgMv0uGOmbov-RRhw" target="_blank">几何变换</a></p>
  <section class="example">
<!--    <div class="block">-->
<!--      <div class="face face1">1</div>-->
<!--    </div>-->
    <div class="block">
      <div class="face face2">2</div>
    </div>
<!--    <div class="block">-->
<!--      <div class="face face3">3</div>-->
<!--    </div>-->
<!--    <div class="block">-->
<!--      <div class="face face4">4</div>-->
<!--    </div>-->
<!--    <div class="block">-->
<!--      <div class="face face5">5</div>-->
<!--    </div>-->
<!--    <div class="block">-->
<!--      <div class="face face6">6</div>-->
<!--    </div>-->

    <div class="block separate">
      <div class="face face1">1分开写</div>
      <div class="face face2">2</div>
      <div class="face face3">3</div>
      <div class="face face4">4</div>
      <div class="face face5">5</div>
      <div class="face face6">6</div>
    </div>

    <div class="block combine3d">
      <div class="face face1">1matrix3d</div>
      <div class="face face2">2</div>
      <div class="face face3">3</div>
      <div class="face face4">4</div>
      <div class="face face5">5</div>
      <div class="face face6">6</div>
    </div>
  </section>
</template>

<script setup>
import { Mat4 } from 'ogl';
import {onMounted} from "vue";

const rad = Math.PI / 4;

// 行主序
let a1 = new Mat4(
    // 旋转矩阵
    1, 0,   0,             0, // 绕X轴旋转
    0, Math.cos(rad), -Math.sin(rad), 0,
    0, Math.sin(rad), Math.cos(rad),  0,
    0, 0,   0,              1
);
let a2 = new Mat4(
    // 旋转矩阵
    Math.cos(rad),  0, Math.sin(rad),  0,
    0,         1, 0,         0, // 绕Y轴旋转
    -Math.sin(rad), 0, Math.cos(rad),  0,
    0,         0, 0,         1
);
let a3 = new Mat4(
    // 旋转矩阵
    Math.cos(rad), -Math.sin(rad),0, 0,
    Math.sin(rad), Math.cos(rad), 0, 0,
    0,   0,             1, 0, // 绕Z轴旋转
    0,   0,             0, 1
);
let b = new Mat4(
    // 平移矩阵
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    100, 0, 0, 1
);
let c = new Mat4(
    // 缩放矩阵
    1.5, 0, 0, 0,
    0, 2.5, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
);

const res = [a1, a2, a3, b, c].reduce((a, b) => {
  return a.multiply(b); // a x b 结果输出到a
});
// console.log(res);

onMounted(() => {
  const combine = document.querySelector('.combine3d');
  const s = res;
  combine.style.setProperty('--trans3d', `matrix3d(${s})`);
});
</script>

<style lang="less" scoped>
.example {
  //perspective: 800px;
}
.block {
  position: relative;
  width: 100px;
  height: 100px;
  color: #fff;
  transform-style: preserve-3d;

  .face {
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 20px;

    &.face1 {
      background: rgba(90, 90, 90, .7);
      transform: translateZ(50px);
    }
    &.face2 {
      background: rgba(0, 210, 0, .7);
      transform: rotateY(180deg) translateZ(50px); // 坐标系：绕Y轴逆时针（向右）转动180度，再沿Z轴平移50px
    }
    &.face3 {
      background: rgba(210, 0, 0, .7);
      transform: rotateY(90deg) translateZ(50px);
    }
    &.face4 {
      background: rgba(0, 0, 210, .7);
      transform: rotateY(-90deg) translateZ(50px);
    }
    &.face5 {
      background: rgba(210, 210, 0, .7);
      transform: rotateX(90deg) translateZ(50px);
    }
    &.face6 {
      background: rgba(210, 0, 210, .7);
      transform: rotateX(-90deg) translateZ(50px);
    }
  }

  //&.normal {
  //  transform: rotate3d(0);
  //}

  &.separate {
    //rotateX(a)：X轴旋转，等同于rotate3d(1, 0, 0, a)，正值时绕X轴向上逆时针旋转，负值时绕X轴向下顺时针旋转
    //rotateY(a)：3D Y轴旋转，等同于rotate3d(0, 1, 0, a)，正值时绕Y轴向右逆时针旋转，负值时绕Y轴向左顺时针旋转
    //rotateZ(a)：3D Z轴旋转，等同于rotate3d(0, 0, 1, a)，正值时绕Z轴顺时针旋转，负值时绕Z轴逆时针旋转
    transform: rotateX(-45deg) rotateY(-45deg) rotateZ(-45deg) translate3d(100px, 0, 0) scale3d(1.5, 2.5, 1);
  }

  &.combine3d {
    --trans3d: none;
    transform: var(--trans3d);
  }
}
</style>
