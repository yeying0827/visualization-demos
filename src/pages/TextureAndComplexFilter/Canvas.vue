<template>
  <h3>其他简单滤镜</h3>
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
import {getImageData, getPixel, getPixelXY, loadImage, traverse} from "../../utils/ImageHandler.js";
import {brightness, saturate, transformColor} from "../../utils/color-matrix.js";
import girl1 from '@/assets/girl1.jpg';
import sunlightpng from '@/assets/sunlight.png';
import explodejpg from '@/assets/explode.jpg';

const tabs = [
  {name: "边缘模糊"},
  {name: "图片融合：阳光照耀"},
  {name: "图片融合：爆炸效果"},
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

const drawByTab = tab => {
  switch (tab) {
    case 0:
      (async function() {
        const img = await loadImage(girl1);
        const imageData = getImageData(img);
        traverse(imageData, ({r, g, b, a, x, y}) => {
          const d = Math.hypot((x - 0.5), (y - 0.5)); // 离图片中心的距离
          a *= 1.0 - 2 * d; // 离图片中心越远，a越小
          return [r, g, b, a];
        });
        canvasRef.value.width = imageData.width;
        canvasRef.value.height = imageData.height;
        context.putImageData(imageData, 0, 0);
      }());
      break;
    case 1:
      (async function() {
        const img = await loadImage(girl1);
        const sunlight = await loadImage(sunlightpng);
        const imageData = getImageData(img);
        const texture = getImageData(sunlight);
        traverse(imageData, ({r, g, b, a, index}) => {
          const texColor = getPixel(texture, index);
          return transformColor([r, g, b, a],
              brightness(1 + 0.7 * texColor[3]), // 入参大于1，调亮
              saturate(2 - texColor[3]) // 透明度越高的点，入参越小，饱和度越低 => 有光照的地方饱和度更高
          )
        });
        canvasRef.value.width = imageData.width;
        canvasRef.value.height = imageData.height;
        context.putImageData(imageData, 0, 0);
      }());
      break;
    case 2:
      (async function() {
        const img = await loadImage(girl1);
        const explode = await loadImage(explodejpg);
        const imageData = getImageData(img);
        const texture = getImageData(explode);
        traverse(imageData, ({r, g, b, a, x, y}) => {
          const texColor = getPixelXY(texture, x, y);
          const e = 0.212 * texColor[0] + 0.714 * texColor[1] + 0.074 * texColor[2];

          return transformColor([r, g, b, a],
              brightness(0.3 + e),
              saturate(1.5)
          )
        });
        canvasRef.value.width = imageData.width;
        canvasRef.value.height = imageData.height;
        context.putImageData(imageData, 0, 0);
      }());
      break;
  }
};
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
