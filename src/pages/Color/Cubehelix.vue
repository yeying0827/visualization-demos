<template>
  <h3>Cubehelix 色盘</h3>
  <canvas height="512" width="512"></canvas>
</template>

<script setup>
import {cubehelix} from 'cubehelix';
import {onMounted} from "vue";
import Canvas2D from "../../utils/Canvas.js";

onMounted(() => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const canvas2d = new Canvas2D(ctx);

  const color = cubehelix(); // 色盘颜色映射函数
  const T = 2000;

  function update(t) {
    const p = 0.5 + 0.5 * Math.sin(t / T);
    // console.log(p);
    ctx.clearRect(-256, -256, 512, 512);
    const {r, g, b} = color(p);
    ctx.fillStyle = `rgb(${255 * r}, ${255 * g}, ${255 * b})`;
    ctx.beginPath();
    ctx.rect(-236, -20, 480 * p, 40);
    ctx.fill();
    requestAnimationFrame(update);
  }

  update(0);
});
</script>

<style scoped>
canvas {
  width: 512px;
  height: 512px;
  background: #000;
}
</style>
