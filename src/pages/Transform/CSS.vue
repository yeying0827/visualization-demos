<template>
  <h3>CSS仿射变换</h3>
  <div class="block separate">我使用分开写</div>
  <div class="block combine">我使用matrix合并写</div>
</template>

<script setup>
import { Mat3 } from 'ogl';
import {onMounted} from "vue";

const rad = Math.PI / 6;

// 行主序
let a = new Mat3(
    // 旋转矩阵
    Math.cos(rad), -Math.sin(rad), 0,
    Math.sin(rad), Math.cos(rad), 0,
    0, 0, 1
);
let b = new Mat3(
    // 平移矩阵
    1, 0, 100,
    0, 1, 50,
    0, 0, 1
);
let c = new Mat3(
    // 缩放矩阵
    1.5, 0, 0,
    0, 1.5, 0,
    0, 0, 1
);

const res = [a, b, c].reduce((prev, current) => {
  return current.multiply(prev); // prev x current 结果输出到current
});
// a
// a x b
// a x b x c
// console.log(res);

onMounted(() => {
  const combine = document.querySelector('.combine');
  const s = res.slice(0, 6);

  combine.style.setProperty('--trans', `matrix(
  ${s[0]},${s[3]},
  ${s[1]},${s[4]},
  ${s[2]},${s[5]}
  )`);
});

// 列主序
// let a = new Mat3(
//     // 旋转矩阵
//     Math.cos(rad), Math.sin(rad), 0,
//     -Math.sin(rad), Math.cos(rad), 0,
//     0, 0, 1
// );
// let b = new Mat3(
//     // 平移矩阵
//     1, 0, 0,
//     0, 1, 0,
//     100, 50, 1
// );
// let c = new Mat3(
//     // 缩放矩阵
//     1.5, 0, 0,
//     0, 1.5, 0,
//     0, 0, 1
// );
//
// const res = [a, b, c].reduce((prev, current) => {
//   return prev.multiply(current); // current x prev 结果输出到prev
// });
// // a
// // b x a
// // c x b x a
//
// onMounted(() => {
//   const combine = document.querySelector('.combine');
//
//   combine.style.setProperty('--trans', `matrix(${res[0]},${res[1]},${res[3]},${res[4]},${res[6]},${res[7]})`);
// });
</script>

<style lang="less" scoped>
.block {
  width: 100px;
  height: 100px;
  color: #fff;
  background: orange;
  //& + .block {
  //  margin-top: 10px;
  //}

  &.separate {
    transform: rotate(30deg) translate(100px, 50px) scale(1.5);
  }

  &.combine {
    --trans: none;
    transform: var(--trans);
  }
}
</style>
