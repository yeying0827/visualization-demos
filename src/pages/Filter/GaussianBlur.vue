<template>
  <h3>平滑效果滤镜：高斯模糊</h3>
  <canvas ref="canvasRef" width="0" height="0"></canvas>
</template>

<script setup>
import {onMounted, ref} from "vue";
// 封装重构
import {loadImage, getImageData, gaussianBlur} from "../../utils/ImageHandler.js";
// 导入图像
import girl1 from '/src/assets/girl1.jpg';

const canvasRef = ref(null);
let context;
onMounted(() => {
  context = canvasRef.value.getContext('2d');

  (async function() {
    // 异步加载图片
    const img = await loadImage(girl1);
    // 获取图片的`imageData`数据对象
    const imageData = getImageData(img);
    const {width, height, data} = imageData;
    // 高斯模糊
    gaussianBlur(data, width, height);
    // 更新canvas内容
    canvasRef.value.width = imageData.width;
    canvasRef.value.height = imageData.height;
    context.putImageData(imageData, 0, 0);
  }());

});
</script>
