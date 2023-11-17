<template>
  <h3>封装高阶参数方程绘图模块</h3>
  <canvas width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted} from "vue";
import Vector2D from "../../utils/vector2d.js";
import parametric from "../../utils/parametric.js";

onMounted(() => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(1, -1); // 绕X轴翻转
  drawAixs();

  function drawAixs() {
    ctx.beginPath();
    ctx.strokeStyle = '#ddd';
    ctx.moveTo(-canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, 0);
    ctx.stroke();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(0, -canvas.height / 2);
    ctx.stroke();
  }

  // 抛物线参数方程
  const para = parametric(
      t => 25 * t,
      t => 25 * t **2
  )
  // 绘制抛物线
  para(-5.5, 5.5).draw(ctx);

  // 阿基米德螺旋线参数方程
  const helical = parametric(
      (t, l) => l * t * Math.cos(t),
      (t, l) => l * t * Math.sin(t)
  );
  helical(0, 50, 500, 5).draw(ctx, {strokeStyle: 'blue'});

  // 星形线
  const star = parametric(
      (t, l) => l * Math.cos(t) ** 3,
      (t, l) => l * Math.sin(t) ** 3
  );
  star(0, Math.PI * 2, 50, 150).draw(ctx, {strokeStyle: 'red'});

  // 二级贝塞尔曲线
  const quadricBezier = parametric(
      (t, [{x: x0}, {x: x1}, {x: x2}]) => (1 - t) ** 2 * x0 + 2 * (1 - t) * t * x1 + t ** 2 * x2,
      (t, [{y: y0}, {y: y1}, {y: y2}]) => (1 - t) ** 2 * y0 + 2 * (1 - t) * t * y1 + t ** 2 * y2
  );
  // 起点都是（0,0），终点均匀分布在半径200的圆上，控制点均匀分布在半径100的圆上
  // const p0 = new Vector2D(0, 0);
  // const p1 = new Vector2D(100, 0);
  // p1.rotate(0.75);
  // const p2 = new Vector2D(200, 0);
  // const count = 30;
  // for (let i = 0; i < count; i ++) {
  //   // 绘制30条从圆心出发，旋转不同角度的二阶贝塞尔曲线
  //   p1.rotate(2 / count * Math.PI);
  //   p2.rotate(2 / count * Math.PI);
  //   quadricBezier(0, 1, 100, [
  //     p0,
  //     p1,
  //     p2
  //   ]).draw(ctx);
  // }

  // 三阶贝塞尔曲线
  const cubicBezier = parametric(
      (t, [{x: x0}, {x: x1}, {x: x2}, {x: x3}]) => (1 - t) ** 3 * x0 + 3 * t * (1 - t) ** 2 * x1 + 3 * (1 - t) * t ** 2 * x2 + t ** 3 * x3,
      (t, [{y: y0}, {y: y1}, {y: y2}, {y: y3}]) => (1 - t) ** 3 * y0 + 3 * t * (1 - t) ** 2 * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3 * y3
  );
  // 起点都为（0,0），终点均匀分布在半径200的圆上，控制点1均匀分布在半径为100的圆上，控制点2均匀分布在半径为150的圆上
  const p0 = new Vector2D(0, 0);
  const p1 = new Vector2D(100, 0);
  p1.rotate(0.75);
  const p2 = new Vector2D(150, 0);
  p2.rotate(-0.75);
  const p3 = new Vector2D(200, 0);
  const count = 30;
  for (let i = 0; i < count; i ++) {
    p1.rotate(2 / count * Math.PI);
    p2.rotate(2 / count * Math.PI);
    p3.rotate(2 / count * Math.PI);
    cubicBezier(0, 1, 100, [
      p0,
      p1,
      p2,
      p3
    ]).draw(ctx);
  }
});
</script>

<style scoped>
canvas {
  width: 512px;
  height: 512px;
  border: 1px solid #eee;
}
</style>
