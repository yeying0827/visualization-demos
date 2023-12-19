<template>
  <h3>RGB和RGBA</h3>
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

  for (let i = 0; i <  3; i ++) {
    const colorVector = randomRGB();
    for (let j = 0; j < 5; j ++) {
      const c = colorVector.clone().scale(0.5 + 0.25 * j);
      ctx.fillStyle = `rgb(${Math.floor(c[0] * 256)}, ${Math.floor(c[1] * 256)}, ${Math.floor(c[2] * 256)})`;
      ctx.beginPath();
      ctx.arc((j - 2) * 60, (i - 1) * 60, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  }
});

function randomRGB() {
  return new Vec3(
      0.5 * Math.random(),
      0.5 * Math.random(),
      0.5 * Math.random(),
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
