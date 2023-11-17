<template>
  <h3>使用Canvas绘制一个正方形</h3>
  <canvas width="512" height="512"></canvas>
  <h3>使用Canvas绘制三角形</h3>
  <canvas width="512" height="512" id="triangle"></canvas>
  <h3>使用Canvas绘制椭圆</h3>
  <canvas width="512" height="512" id="ellipse"></canvas>
  <h3>使用Canvas绘制五角星</h3>
  <canvas width="512" height="512" id="star"></canvas>
</template>

<script setup>
import {onMounted} from "vue";

onMounted(() => {
  drawSquare();
  drawTriangle();
  drawEllipse();
  drawStar();
});

function drawSquare() {
  // 获取canvas元素
  const canvas = document.querySelector('canvas');
  // 获取2D绘图上下文对象
  const context = canvas.getContext('2d');

  const rectSize = [100, 100];
  context.fillStyle = 'red'; // 设置填充颜色
  context.beginPath(); // 告诉Canvas现在绘制的路径
  // context.rect(0.5*canvas.width, 0.5*canvas.height, ...rectSize); // 完成绘图
  // context.rect(0.5*(canvas.width - rectSize[0]), 0.5*(canvas.height - rectSize[1]), ...rectSize); // 使居中，方法1
  context.save(); // 暂存后续设置的画布状态
  context.translate(-0.5 * rectSize[0], -0.5 * rectSize[1]); // 使居中，方法2
  context.rect(0.5 * context.canvas.width, 0.5 * context.canvas.height, ...rectSize);
  context.restore(); // 将画布状态恢复成save指令前的设置
  context.rect(0.5 * context.canvas.width, 0.5 * context.canvas.height, ...rectSize);
  context.fill(); // 输出到画布中
}

function drawTriangle() {
  const canvas = document.querySelector('#triangle');
  const ctx = canvas.getContext('2d');

  const edge = 200;
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.save();
  ctx.translate(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height); // 更改原点
  ctx.moveTo(0, edge * Math.cos(60) / 2); // 最高顶点（不懂为啥Y轴值不是负数）
  ctx.lineTo(100, -edge * Math.cos(60) / 2);
  ctx.lineTo(-100, -edge * Math.cos(60) / 2);
  ctx.fill();
// ctx.stroke();
  ctx.restore();
}

function drawEllipse() {
  const canvas = document.querySelector('#ellipse');
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.ellipse(0.5 * canvas.width, 0.5 * canvas.height, 200, 150, 0, 0, 2 * Math.PI);
  ctx.fill();
}

function drawStar() {
  // 绘制五角星
  // 思路：两个圆取五个点
  const canvas = document.querySelector('#star');
  const ctx = canvas.getContext('2d');

  const R = 250;
  const r = 130;
  const convertAngle = (deg) => deg * Math.PI / 180;
  const outPoints = [
    [0, - R],
    [R * Math.cos(convertAngle(18)), - R * Math.sin(convertAngle(18))],
    [R * Math.sin(convertAngle(36)), R * Math.cos(convertAngle(36))],
    [- R * Math.sin(convertAngle(36)), R * Math.cos(convertAngle(36))],
    [- R * Math.cos(convertAngle(18)), - R * Math.sin(convertAngle(18))]
  ];
  const innerPoints = [
    [r * Math.sin(convertAngle(36)), -r * Math.cos(convertAngle(36))],
    [r * Math.cos(convertAngle(18)), r * Math.sin(convertAngle(18))],
    [0, r],
    [- r * Math.cos(convertAngle(18)), r * Math.sin(convertAngle(18))],
    [- r * Math.sin(convertAngle(36)), -r * Math.cos(convertAngle(36))]
  ];
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.translate(0.5 * canvas.width, 0.5 * canvas.height);
  ctx.moveTo(...outPoints[0]);
  ctx.lineTo(...innerPoints[0]);
  for (let i = 1; i < 5; i ++) {
    ctx.lineTo(...outPoints[i]);
    if (innerPoints[i].length > 0) ctx.lineTo(...innerPoints[i]);
  }
  ctx.closePath();
  ctx.stroke();
}
</script>

<style scoped>
canvas {
  background: #eee;
  width: 256px;
  height: 256px;
}
</style>
