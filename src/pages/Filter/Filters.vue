<template>
  <h3>滤镜函数使用</h3>
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
import {brightness, channel, saturate, transformColor} from "../../utils/color-matrix.js";
// 导入图像
import girl1 from '/src/assets/girl1.jpg';

const tabs = [
  {name: "滤镜函数：channel"},
  {name: "滤镜函数：叠加使用"},
];
const checkedTab = ref(0);

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
        const img = await loadImage(girl1);
        // 获取图片的`imageData`数据对象
        const imageData = getImageData(img);
        // 遍历`imageData`数据对象
        // 增强红色通道，减弱绿色通道
        traverse(imageData, ({r, g, b, a}) => {
          return transformColor([r, g, b, a], channel({r: 1.5, g: 0.75}));
        });
        // 更新canvas内容
        canvasRef.value.width = imageData.width;
        canvasRef.value.height = imageData.height;
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
        // 叠加效果
        traverse(imageData, ({r, g, b, a}) => {
          return transformColor([r, g, b, a],
              channel({r: 1.2}),  // 增强红色通道
              brightness(1.2), // 增强亮度
              saturate(1.2), // 增强饱和度
          );
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
