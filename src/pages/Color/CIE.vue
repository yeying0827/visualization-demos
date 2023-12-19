<template>
  <h3>CIE Lab和CIE Lch</h3>
  <canvas height="512" width="512"></canvas>
</template>

<script setup>
import * as d3 from 'd3-color';
import {onMounted} from "vue";
import Canvas2D from "../../utils/Canvas.js";

onMounted(() => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const canvas2d = new Canvas2D(ctx);

  for (let i = 0; i < 20; i ++) {
    const c = d3.lab(30, i * 15 - 150, i * 15 - 150).rgb();
    ctx.fillStyle = `rgb(${c.r}, ${c.g}, ${c.b})`;
    ctx.beginPath();
    ctx.arc((i - 10) * 20, 60, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 20; i ++) {
    const c = d3.lab(i * 5, 80, 80).rgb();
    ctx.fillStyle = `rgb(${c.r}, ${c.g}, ${c.b})`;
    ctx.beginPath();
    ctx.arc((i - 10) * 20, -60, 10, 0, Math.PI * 2);
    ctx.fill();
  }
});
</script>

<style scoped>
canvas {
  width: 512px;
  height: 512px;
  background: #eee;
}
</style>
