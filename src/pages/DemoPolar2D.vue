<template>
  <h3>使用Canvas</h3>
  <canvas ref="canvasRef" height="512" width="512"></canvas>
</template>

<script setup>
import {onMounted, ref} from "vue";
import Canvas2D from "../utils/Canvas.js";
import parametric from "../utils/parametric.js";

const canvasRef = ref(null);
onMounted(() => {
  const ctx = canvasRef.value.getContext('2d');
  const canvas2d = new Canvas2D(ctx);
  canvas2d.drawAxis('#ddd');
  rose(0, Math.PI, 100, 200, 5).draw(ctx, {strokeStyle: 'blue'});
});

const fromPolar = (r, θ) => {
  return [r * Math.cos(θ), r * Math.sin(θ)];
}
const rose = parametric(
    (t, a, k) => a * Math.cos(k * t), // a * Math.cos(k * t) - r = 0
    t => t,
    fromPolar
);
</script>
