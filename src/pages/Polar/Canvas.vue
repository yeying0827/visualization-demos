<template>
  <h3>使用Canvas</h3>
  <canvas ref="canvasRef" height="512" width="512"></canvas>
</template>

<script setup>
import {onMounted, ref} from "vue";
import Canvas2D from "../../utils/Canvas.js";
import parametric from "../../utils/parametric.js";

const canvasRef = ref(null);
onMounted(() => {
  const ctx = canvasRef.value.getContext('2d');
  const canvas2d = new Canvas2D(ctx);
  canvas2d.drawAxis('#ddd');

  arc(0, Math.PI).draw(ctx); // 半径为200的半圆
  // args: 200, 5
  // a-200  k-5
  rose(0, Math.PI, 100, 200, 5).draw(ctx, {strokeStyle: 'blue'}); // 玫瑰线
  // a-100
  heart(0, 2 * Math.PI, 100, 100).draw(ctx, {strokeStyle: 'red'}); // 心形线
  // a-100
  foliumRight(-Math.PI / 4, Math.PI / 4, 100, 100).draw(ctx, {strokeStyle: 'green'});
  foliumLeft(-Math.PI / 4, Math.PI / 4, 100, 100).draw(ctx, {strokeStyle: 'green'});
});

const fromPolar = (r, θ) => {
  return [r * Math.cos(θ), r * Math.sin(θ)];
}

const arc = parametric(
    t => 200, // 半径
    t => t, // 单位旋转角度
    fromPolar,
);
// 玫瑰线
const rose = parametric(
    (t, a, k) => a * Math.cos(k * t), // r
    t => t, // t:单位旋转角度
    fromPolar,
);
// 心形线
const heart = parametric(
    (t, a) => a * (1 - Math.sin(t)),
    t => t, // t:单位旋转角度
    fromPolar
);
// 双纽线
const foliumRight = parametric(
    // √(2 x a² x cos(2t))
    (t, a) => a * Math.sqrt(2 * Math.cos(2 * t)),
    t => t, // t:单位旋转角度
    fromPolar
);
const foliumLeft = parametric(
    (t, a) => -Math.sqrt(2 * a ** 2 * Math.cos(2 * t)),
    t => t, // t:单位旋转角度
    fromPolar
);


</script>
