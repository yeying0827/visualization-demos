<template>
  <h3>封装高阶参数方程绘图模块</h3>
  <canvas width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted} from "vue";
import Vector2D from "../../utils/vector2d.js";
import parametric, {parabola2, helical, star, quadricBezier, cubicBezier} from "../../utils/parametric.js";
import Canvas2D from "../../utils/Canvas.js";

onMounted(() => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const canvas2d = new Canvas2D(ctx);
  canvas2d.drawAxis('#ddd');

  // 绘制抛物线
  parabola2(-5.5, 5.5).draw(ctx);

  // 阿基米德螺旋线
  helical(0, 50, 500, 5).draw(ctx, {strokeStyle: 'blue'});

  // 星形线
  star(0, Math.PI * 2, 50, 150).draw(ctx, {strokeStyle: 'red'});

  // 二级贝塞尔曲线
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
