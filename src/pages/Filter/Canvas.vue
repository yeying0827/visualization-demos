<template>
  <h3>Canvas filter：原生Canvas滤镜</h3>
  <h4>灰度化</h4>
  <canvas ref="canvasRef" width="0" height="0"></canvas>
  <h4>叠加使用</h4>
  <canvas ref="canvasRef2" width="0" height="0"></canvas>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {loadImage} from "../../utils/ImageHandler.js";
// 导入图像
import girl1 from '/src/assets/girl1.jpg';
import girl2 from '/src/assets/girl2.jpg';

const canvasRef = ref(null);
const canvasRef2 = ref(null);
onMounted(() => {
  const context = canvasRef.value.getContext('2d');

  (async function() {
    const img = await loadImage(girl1);
    canvasRef.value.width = img.width;
    canvasRef.value.height = img.height;

    context.filter = "grayscale(100%)";
    context.drawImage(img, 0, 0);
  }());

  const context2 = canvasRef2.value.getContext('2d');

  (async function() {
    const img = await loadImage(girl2);
    canvasRef2.value.width = img.width;
    canvasRef2.value.height = img.height;

    context2.filter = "blur(1.2px) grayscale(0.5) saturate(1.2) contrast(1.1) brightness(1.2)";
    context2.drawImage(img, 0, 0);
  }());
});
</script>
