<template>
  <h3>Canvas2D填充多边形</h3>
  <canvas height="512" width="512"></canvas>
</template>

<script setup>
import {onMounted} from "vue";
import Vector2D from "../../utils/vector2d.js";
import Canvas2D from "../../utils/Canvas.js";

onMounted(() => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const canvas2d = new Canvas2D(ctx);

  // 构建多边形的顶点
  const points = [new Vector2D(0, 100)];
  for(let i = 1; i <= 4; i ++) {
    const p = points[0].copy().rotate(i * Math.PI * 0.4);
    points.push(p);
  }

  const polygon = [
    ...points
  ];
  // 绘制正五边形
  ctx.save();
  ctx.translate(-128, 0);
  canvas2d.fillPolygon(polygon, {fillStyle: "black", rule: "evenodd"});
  ctx.restore();

  const stars = [
    points[0],
    points[2],
    points[4],
    points[1],
    points[3]
  ];
  // 绘制五角星
  ctx.save();
  ctx.translate(128, 0);
  canvas2d.fillPolygon(stars, {fillStyle: "black", rule: "evenodd"});
  ctx.restore();
});
</script>

<style scoped>
canvas {
  height: 512px;
  width: 512px;
  background: #eee;
}
</style>
