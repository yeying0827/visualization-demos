<template>
  <h3>用向量绘制一棵树</h3>
  <canvas width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted} from "vue";
import Vector2D from "../../utils/vector2d.js";

onMounted(() => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  // 坐标变换：坐标原点从左上角移动到左下角，并且让Y轴翻转向上
  ctx.translate(0, canvas.height);
  ctx.scale(1, -1);
  ctx.lineCap = 'round';

  const v0 = new Vector2D(256, 0);
  drawBranch(ctx, v0, 50, 10, Math.PI / 2, 3);

  /**
   ** @param context Canvas2D上下文
   ** @param v0 树枝的起点坐标
   ** @param length 当前树枝的长度
   ** @param thickness 当前树枝的粗细
   ** @param dir 当前树枝的方向（与X轴的夹角，单位为弧度）
   ** @param bias 一个随机偏向因子
   */
  function drawBranch(context, v0, length, thickness, dir, bias) {
    // 创建一个单位向量`(1, 0)`，它是一个朝向X轴，长度为1的向量；
    // 然后旋转dir弧度；
    // 再乘以树枝长度length；这样就能计算出树枝的终点坐标了
    const v = new Vector2D(1, 0).rotate(dir).scale(length);
    const v1 = v0.copy().add(v);

    context.lineWidth = thickness;
    context.beginPath();
    context.moveTo(...v0);
    context.lineTo(...v1);
    context.stroke();

    // 从一个起始角度开始递归地旋转树枝，每次将树枝分叉成左右两个分枝
    if (thickness > 2) {
      // const left = dir + 0.2;
      const left = Math.PI / 4 + 0.5 * (dir + 0.2) + bias * (Math.random() - 0.5); // 加入随机因子，让迭代生成的新树枝有一个随机的偏转角度
      drawBranch(context, v1, length * 0.9, thickness * 0.8, left, bias * 0.9);
      // const right = dir - 0.2;
      const right = Math.PI / 4 + 0.5 * (dir - 0.2) + bias * (Math.random() - 0.5);
      drawBranch(context, v1, length * 0.9, thickness * 0.8, right, bias * 0.9);
    }

    // 随机绘制一些花瓣
    if (thickness < 5 && Math.random() < 0.3) {
      context.save();
      context.strokeStyle = "#c72c35";
      const th = Math.random() * 6 + 3;
      context.lineWidth = th;
      context.beginPath();
      context.moveTo(...v1);
      context.lineTo(v1.x, v1.y - 2);
      context.stroke();
      context.restore();
    }
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
