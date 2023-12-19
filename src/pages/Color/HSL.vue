<template>
  <h3>HSL和HSV</h3>
  <canvas width="512" height="512"></canvas>
</template>

<script setup>
import {Vec3} from 'ogl';
import {onMounted} from "vue";
import Canvas2D from "../../utils/Canvas.js";

onMounted(() => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const canvas2d = new Canvas2D(ctx);

  const [h, s, l] = randomColor();
  for (let i = 0; i <  3; i ++) {
    // i=0, [0 0.5)
    // i=1, [0.25 0.75)
    // i=2, [0.5 1)
    const p = (i * 0.25 + h) % 1;
    for (let j = 0; j < 5; j ++) {
      const d = j - 2;
      // h
      // s: 0.4  0.55 0.7  0.85 1.0
      // l: 0.21 0.33 0.45 0.57 0.69
      ctx.fillStyle = `hsl(${Math.floor(p * 360)}, ${Math.floor((0.15 * d + s) * 100)}%, ${Math.floor((0.12 * d + l) * 100)}%)`;
      ctx.beginPath();
      ctx.arc((j - 2) * 60, (i - 1) * 60, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 20; i ++) {
    ctx.fillStyle = `hsl(${Math.floor(i * 15)}, 50%, 50%)`;
    ctx.beginPath();
    ctx.arc((i - 10) * 20, 200, 10, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 20; i ++) {
    ctx.fillStyle = `hsl(${Math.floor((i % 2 ? 60 : 210) + 3 * i)}, 50%, 50%`;
    ctx.beginPath();
    ctx.arc((i - 10) * 20, 140, 10, 0, Math.PI * 2);
    ctx.fill();
  }
});

function randomColor() {
  return new Vec3(
      0.5 * Math.random(), // 色相：0~0.5之间的值
      0.7, // 初始饱和度 0.7
      0.45, // 初始亮度 0.45
  )
}

</script>

<style scoped>
canvas {
  width: 512px;
  height: 512px;
  background: #eee;
}
</style>
