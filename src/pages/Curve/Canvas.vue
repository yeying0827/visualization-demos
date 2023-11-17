<template>
  <h3>使用Canvas指令绘制曲线</h3>
  <canvas height="512" width="512"></canvas>
</template>

<script setup>
import {onMounted} from "vue";

onMounted(() => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(1, -1);

  drawCircle();
  drawEllipse();
  drawBezierCurve();

  function drawCircle() {
    ctx.beginPath();
    ctx.strokeStyle = "orange";
    ctx.arc(0, 0, 100, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawEllipse() {
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.ellipse(0, 0, 100, 50, /* 0 */Math.PI / 3, 0, Math.PI * 2/* , true */);
    ctx.stroke();
  }

  function drawBezierCurve() {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(80, 50, 140, -50, 200, 0);
    // ctx.moveTo(-10, -30);
    // ctx.bezierCurveTo(100, 0, 100, -100, 180, -100);
    ctx.strokeStyle = "red";
    ctx.stroke();
  }
});
</script>

<style scoped>
canvas {
  height: 512px;
  width: 512px;
  border: 1px solid #eee;
}
</style>
