<template>
  <h3>灰度化图片</h3>
  <div>
    <span
        class="filter-type"
        :class="{active: checkedTab === index}"
        @click="checkedTab = index"
        v-for="(item, index) in tabs">{{ item.name }}</span>
  </div>
  <canvas ref="canvasRef" width="0" height="0"></canvas>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
// 封装重构
import {loadImage, getImageData, traverse} from "../../utils/ImageHandler.js";
import {grayscale, transformColor} from "../../utils/color-matrix.js";
// 导入图像
import girl1 from '@/assets/girl1.jpg';

const tabs = [
  {name: "普通写法"},
  {name: "重构写法"},
  {name: "使用color-matrix优化"},
];
const checkedTab = ref(0);

const localLoadImage = src => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  return new Promise(resolve => {
    img.onload = () => {
      resolve(img);
    };
    img.src = src;
  });
};

const canvasRef = ref(null);
let context;
onMounted(() => {
  context = canvasRef.value.getContext('2d');

  drawByTab(checkedTab.value);
  watch(checkedTab, () => {
    drawByTab(checkedTab.value);
  });

});

const drawByTab = type => {
  switch (type) {
    case 0:
      console.log('case 0');
      (async function() {
        // 异步加载图片
        const img = await localLoadImage(girl1);

        const {width, height} = img;
        // 将图片绘制到canvas
        canvasRef.value.width = width;
        canvasRef.value.height = height;
        context.drawImage(img, 0, 0);
        // 获取imageData
        const imageData = context.getImageData(0, 0, width, height);
        const data = imageData.data;
        // 遍历处理像素点
        for (let i = 0; i < width * height * 4; i += 4) {
          const r = data[i],
              g = data[i + 1],
              b = data[i + 2],
              a = data[i + 3];
          // 对RGB通道进行加权平均
          const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = a;
        }
        // 将处理好的数据写回到 Canvas 中去
        context.putImageData(imageData, 0, 0);
      }());
      break;
    case 1:
      console.log('case 1');
      (async function() {
        // 异步加载图片
        const img = await loadImage(girl1);
        // 获取图片的`imageData`数据对象
        const imageData = getImageData(img);
        // 遍历`imageData`数据对象
        traverse(imageData, ({r, g, b, a}) => {
          // 对每个像素点进行灰度化处理（线性方程）
          const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          return [v, v, v, a];
        });
        // 更新canvas内容
        canvasRef.value.width = imageData.width;
        canvasRef.value.height = imageData.height;
        context.putImageData(imageData, 0, 0);
      }());
      break;
    case 2:
      console.log('case 2');
      (async function() {
        // 异步加载图片
        const img = await loadImage(girl1);
        // 获取图片的`imageData`数据对象
        const imageData = getImageData(img);
        // 遍历`imageData`数据对象
        // 使用color-matrix优化
        traverse(imageData, ({r, g, b, a}) => {
          return transformColor([r, g, b, a], grayscale(1));
        });
        // 更新canvas内容
        canvasRef.value.width = imageData.width;
        canvasRef.value.height = imageData.height;
        context.putImageData(imageData, 0, 0);
      }());
      break;
  }
}
</script>

<style scoped>
.filter-type {
  display: inline-block;
  padding: 4px 10px;
  background-color: #646cff;
  color: #fff;
  cursor: pointer;
}
.filter-type.active {
  background-color: #4b52fc;
}
.filter-type + .filter-type {
  margin-left: 5px;
}
</style>
