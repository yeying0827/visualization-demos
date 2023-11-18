<template>
  <h3>使用参数方程描述曲线</h3>
  <canvas width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted} from "vue";
import {arc, ellipse, parabola} from "../../utils/parametric.js";
import Canvas2D from "../../utils/Canvas.js";

onMounted(() => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const canvas2d = new Canvas2D(ctx);

  canvas2d.strokePolygon(arc(0, 0, 100));
  canvas2d.strokePolygon(ellipse(0, 0, 50, 100));
  canvas2d.strokePolygon(parabola(0, 0, 5.5, -10, 10));
});
</script>

<style scoped>
canvas {
  width: 512px;
  height: 512px;
  border: 1px solid #eee;
}
</style>
