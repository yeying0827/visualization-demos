<template>
  <div class="canvas-container" ref="canvasContainerRef" :style="{width: containerWidth + 'px'}">
    <canvas ref="canvasRef" width="0" height="0"></canvas>
    <canvas ref="magnifier" width="0" height="0" id="magnifier" :style="position"></canvas>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {getImageData, loadImage} from "../utils/ImageHandler.js";
// 导入图像
import girl1 from '/src/assets/girl1.jpg';

const canvasRef = ref(null);
const magnifier = ref(null);
const canvasContainerRef = ref(null);

const originSize = 40; // 待放大的区域的原始大小
const zoom = 5; // 放大倍数 5*5=25

const position = reactive({
  left: 0,
  top: 0
});
const containerWidth = ref(0);

onMounted(() => {
  const context = canvasRef.value.getContext('2d');
  const mContext = magnifier.value.getContext('2d');

  (async function() {
    const img = await loadImage(girl1);
    canvasRef.value.width = img.width;
    canvasRef.value.height = img.height;
    context.drawImage(img, 0, 0);
    const {left, top} = canvasRef.value.getBoundingClientRect();
    containerWidth.value = img.width;

    magnifier.value.width = originSize * zoom;
    magnifier.value.height = originSize * zoom;

    const mouseMoveHandler = e => {
      // 相对画布的坐标
      const center = {
        x: Math.floor(e.pageX - left),
        y: Math.floor(e.pageY - top)
      };
      position.left = (center.x - originSize * zoom / 2) + 'px';
      position.top = (center.y - originSize * zoom / 2) + 'px';
      // 待放大区域的像素信息
      const originImageData = getImageData(img, [center.x - originSize / 2, center.y - originSize / 2, originSize, originSize]);
      // 新的像素信息对象
      const areaImageData = mContext.createImageData(magnifier.value.width, magnifier.value.height);
      let count = 0;
      for (let j = 0; j < originSize * zoom; j += zoom) {
        for (let i = 0; i < originSize * zoom; i += zoom) {

          for (let k = j; k < j + zoom; k ++) {
            for (let m = i; m < i + zoom; m ++) {
              const index = (k * originSize * zoom + m) * 4;
              areaImageData.data[index] = originImageData.data[count];
              areaImageData.data[index + 1] = originImageData.data[count + 1];
              areaImageData.data[index + 2] = originImageData.data[count + 2];
              areaImageData.data[index + 3] = originImageData.data[count + 3];
            }
          }
          count += 4;
        }
      }
      mContext.putImageData(areaImageData, 0, 0);
    };

    const addEvent = () => {
      canvasContainerRef.value.addEventListener('mousemove', mouseMoveHandler);
    }
    addEvent();
  }());
});
</script>

<style scoped>
.canvas-container {
  position: relative;
  overflow: hidden;
}

#magnifier {
  position: absolute;
  border-radius: 50%;
  box-shadow: 0 0 10px 4px rgba(12, 12, 12, .5);
}
</style>
