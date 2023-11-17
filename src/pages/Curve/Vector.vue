<template>
  <h3>向量绘制正多边形</h3>
  <canvas width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted} from "vue";
import Vector2D from "../../utils/vector2d.js";

onMounted(() => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  ctx.translate(canvas.width / 2,  canvas.height / 2);
  ctx.scale(1, -1);

  /**
   ** @param edges 边数
   * @param x 绘制的起点坐标x
   * @param y 绘制的起点坐标y
   * @param step 边长
   */
  function regularShape(edges = 3, x, y, step) {
    const ret = [];
    // 正多边形内角和 = (n - 2) * 180°
    // 每个内角的角度 = (n - 2) * 180° / n
    // 每个角要旋转到下一个角的旋转角度 = 每个角的补角 = 180° - (n-2) / n * 180°
    const delta = Math.PI * (1 - (edges - 2) / edges);
    let p = new Vector2D(x, y);
    const dir = new Vector2D(step, 0);
    ret.push(p);
    for(let i = 0; i < edges; i ++) {
      p = p.copy().add(dir.rotate(delta));
      ret.push(p);
    }
    return ret;
  }

  function draw(vectors) {
    ctx.beginPath();
    ctx.moveTo(...vectors[0]);
    for(let i = 1; i < vectors.length; i ++) {
      ctx.lineTo(...vectors[i]);
    }
    ctx.closePath();
    ctx.stroke();
  }

  draw(regularShape(3, 128, 128, 100)); // 绘制三角形
  draw(regularShape(6, -64, 128, 50)); // 绘制六边形
  draw(regularShape(11, -64, -64, 30)); // 绘制十一边形
  draw(regularShape(60, 128, -64, 6)); // 绘制六十边形
});
</script>

<style scoped>
canvas {
  width: 512px;
  height: 512px;
  border: 1px solid #eee;
}
</style>
