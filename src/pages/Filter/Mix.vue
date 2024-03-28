<template>
  <h3>叠加使用：普通滤镜+高斯模糊</h3>
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
import {loadImage, getImageData, gaussianBlur, traverse} from "../../utils/ImageHandler.js";
import {brightness, channel, contrast, grayscale, saturate, transformColor} from "../../utils/color-matrix.js";
// 导入图像
import girl2 from '/src/assets/girl2.jpg';

const tabs = [
  {name: "原图"},
  {name: "滤镜：高斯模糊+灰度化+增强饱和度、对比度、亮度"},
];
const checkedTab = ref(1);

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
        const img = await loadImage(girl2);
        // 获取图片的`imageData`数据对象
        const imageData = getImageData(img);
        const {width, height, data} = imageData;
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
        const img = await loadImage(girl2);
        // 获取图片的`imageData`数据对象
        const imageData = getImageData(img);
        const {width, height, data} = imageData;
        // 高斯模糊
        gaussianBlur(data, width, height);
        traverse(imageData, ({r, g, b, a}) => {
          return transformColor([r, g, b, a],
              grayscale(0.5),
              saturate(1.2),
              contrast(1.1),
              brightness(1.2),
          )
        })
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
