<template>
  <h3>使用参数方程描述曲线</h3>
  <canvas width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted} from "vue";

onMounted(() => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(1, -1); // 绕X轴翻转

  const TAU_SEGMENTS = 60;
  const TAU = Math.PI * 2;
  // 获得圆形曲线顶点集合
  // x = x0 + r * cos(θ)
  // y = y0 + r * sin(θ)
  function arc(x0, y0, radius, startAng = 0, endAng = Math.PI * 2) {
    const ang = Math.min(TAU, endAng - startAng);
    const ret = ang === TAU ? []: [[x0, y0]];
    const segments = Math.round(TAU_SEGMENTS * ang / TAU);
    for (let i = 0; i <= segments; i ++) {
      const x = x0 + radius * Math.cos(startAng + ang * i / segments);
      const y = y0 + radius * Math.sin(startAng + ang * i / segments);
      ret.push([x, y]);
    }
    return ret;
  }

  // 获得椭圆曲线顶点集合
  // x = x0 + a * cos(θ)
  // y = y0 + b * sin(θ)
  function ellipse(x0, y0, radiusX, radiusY, startAng = 0, endAng = Math.PI * 2) {
    const ang = Math.min(TAU, endAng - startAng);
    const ret = ang === TAU ? [] : [[x0, y0]];
    const segments = Math.round(TAU_SEGMENTS * ang / TAU);
    for (let i = 0; i <= segments; i ++) {
      const x = x0 + radiusX * Math.cos(startAng + ang * i / segments);
      const y = y0 + radiusY * Math.sin(startAng + ang * i / segments);
      ret.push([x, y]);
    }
    return ret;
  }

  const LINE_SEGMENTS = 60;
  // 获取抛物线顶点集合
  //  x = x0 + 2pt²
  //  y = y0 + 2pt
  // 抛物线的参数方程是X轴线性方程，Y轴二次方程；物理意义：水平方向匀速，垂直方向匀加速
  function parabola(x0, y0, p, min, max) {
    const ret = [];
    for(let i = 0; i <= LINE_SEGMENTS; i ++) {
      const s = i / 60;
      const t = min * (1 - s) + max * s;
      const x = x0 + 2 * p * t ** 2;
      const y = y0 + 2 * p * t;
      ret.push([x, y]);
    }
    return ret;
  }

  function draw(array) {
    ctx.beginPath();
    ctx.moveTo(...array[0]);
    for (let i = 1; i < array.length; i ++) {
      ctx.lineTo(...array[i]);
    }
    ctx.closePath();
    ctx.stroke();
  }

  draw(arc(0, 0, 100));
  draw(ellipse(0, 0, 50, 100));
  draw(parabola(0, 0, 5.5, -10, 10));
});
</script>

<style scoped>
canvas {
  width: 512px;
  height: 512px;
  border: 1px solid #eee;
}
</style>
