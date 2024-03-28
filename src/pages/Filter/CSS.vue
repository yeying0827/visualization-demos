<template>
  <h3>CSS滤镜</h3>
  <h4>灰度化</h4>
  <img :src="girl1" alt="" style="filter: grayscale(100%);">
  <h4>叠加使用</h4>
  <img :src="girl2" alt="" style="filter: blur(1.2px) grayscale(0.5) saturate(1.2) contrast(1.1) brightness(1.2);">
</template>

<script setup>
// 导入图像
import girl1 from '/src/assets/girl1.jpg';
import girl2 from '/src/assets/girl2.jpg';
</script>
