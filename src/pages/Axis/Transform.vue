<template>
  <h3>坐标转换</h3>
  <canvas width="512" height="256"></canvas>
</template>

<script setup>
import {onMounted} from "vue";

onMounted(() => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  // 山的高度100，底边200
  // 两座山的中心位置到中线的距离都是80
  const hillHeight = 100, hillWidth = 200;
  const hill = [
    [
      [-180, 0],
      [-80, hillHeight],
      [20, 0]
    ],
    [
      [-20, 0],
      [80, hillHeight],
      [180, 0]
    ]
  ];
  // 太阳的圆心高度是150
  const sunHeight = 150
  const sun = [
    [0, sunHeight]
  ];
  const sunRadius = 50;

  ctx.save();
  ctx.translate(256, 256);
  ctx.scale(1, -1);

  ctx.moveTo(...hill[0][0]);
  ctx.lineTo(...hill[0][1]);
  ctx.lineTo(...hill[0][2]);
  ctx.moveTo(...hill[1][0]);
  ctx.lineTo(...hill[1][1]);
  ctx.lineTo(...hill[1][2]);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 4;
  ctx.fillStyle = "rgba(255, 255, 0, 0.4)";
  ctx.arc(...sun[0], sunRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
});
</script>
