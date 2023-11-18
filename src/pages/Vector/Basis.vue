<template>
  <h3>向量乘法的基础使用</h3>
  <canvas width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted} from "vue";
import Vector2D from "../../utils/vector2d.js";
import Canvas2D from "../../utils/Canvas.js";

let canvas2d = null;
onMounted(() => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  canvas2d = new Canvas2D(ctx);
  canvas2d.drawAxis();

  drawLines(ctx);

  const rect = canvas.getBoundingClientRect();
  const left = rect.left,
      top = rect.top;
  canvas.addEventListener('click', event => {
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    canvas2d.drawAxis();
    drawLines(ctx);

    const offsetX = (event.clientX - left) - canvas.width / 2,
        offsetY = canvas.height / 2 -(event.clientY - top);
    console.log(left, top, offsetX, offsetY);

    const point = new Vector2D(offsetX, offsetY);
    // 判断点是否在两个向量夹角内
    const isInRange = new Vector2D(0, 1).dot(point.normalize()) >= Math.cos(Math.PI / 6);
    canvas2d.drawText(isInRange? '点在夹角内' : '不在夹角内', -100, 100, "orange");

    ctx.beginPath();
    ctx.arc(offsetX, offsetY, 4, 0, Math.PI * 2);
    ctx.fillStyle = "purple";
    ctx.fill();

  })
});

function drawLines(ctx) {
  const p0 = new Vector2D(0, 0);
  const p1 = new Vector2D(-128, 256);
  const p2 = new Vector2D(128, 256);
  canvas2d.drawLine(p0, p1, 'blue');
  canvas2d.drawLine(p0, p2, 'blue');
}
</script>

<style scoped>
canvas {
  width: 512px;
  height: 512px;
}
</style>
