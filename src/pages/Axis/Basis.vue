<template>
  <h3>基础使用</h3>
  <canvas width="512" height="256"></canvas>
</template>

<script setup>
import {onMounted} from "vue";

onMounted(() => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  // 山的高度100，底边200
  // 两座山的中心位置到中线的距离都是80
  const bottomCenter = [
    canvas.width / 2,
    canvas.height
  ];
  const hillHeight = 100, hillWidth = 200;
  const hill = [
    [
      [bottomCenter[0] - 80 - hillWidth / 2, bottomCenter[1]],
      [bottomCenter[0] - 80, canvas.height - hillHeight],
      [bottomCenter[0] + 20, bottomCenter[1]]
    ],
    [
      [bottomCenter[0] - 20, bottomCenter[1]],
      [bottomCenter[0] + 80, canvas.height - hillHeight],
      [bottomCenter[0] + 80 + hillWidth / 2, bottomCenter[1]]
    ]
  ];
  // 太阳的圆心高度是150
  const sunHeight = 150
  const sun = [
    [bottomCenter[0], canvas.height - sunHeight]
  ];
  const sunRadius = 50;
  ctx.beginPath();
  ctx.moveTo(...hill[0][0]);
  ctx.lineTo(...hill[0][1]);
  ctx.lineTo(...hill[0][2]);
  ctx.moveTo(...hill[1][0]);
  ctx.lineTo(...hill[1][1]);
  ctx.lineTo(...hill[1][2]);
  ctx.lineWidth = 2; // 山的描边宽度
  ctx.stroke();
  ctx.beginPath();
  ctx.save();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 4; // 太阳的描边宽度
  ctx.fillStyle = "rgba(255, 255, 0, 0.4)";
  ctx.arc(...sun[0], sunRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
});
</script>

<style scoped>
canvas {
  width: 512px;
  height: 256px;
  border: 1px solid #eee;
}
</style>
