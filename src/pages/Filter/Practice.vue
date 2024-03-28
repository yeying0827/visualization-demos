<template>
  <h3>课后练习：局部放大器</h3>
  <div class="canvas-container" ref="containerRef">
    <canvas ref="canvasRef" width="0" height="0"></canvas>
    <canvas ref="magnifier" width="0" height="0" id="magnifier" :style="position"></canvas>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {getImageData, loadImage} from "../../utils/ImageHandler.js";
// 导入图像
import girl1 from '/src/assets/girl1.jpg';

const canvasRef = ref(null);
const magnifier = ref(null);
const containerRef = ref(null);

let originSize = 40; // 原图大小
let zoom = 5; // 放大倍数

const position = reactive({
  left: 0,
  top: 0
});

onMounted(() => {
  const context = canvasRef.value.getContext('2d');
  const mContext = magnifier.value.getContext('2d');

  (async function() {
    const img = await loadImage(girl1);
    canvasRef.value.width = img.width;
    canvasRef.value.height = img.height;
    context.drawImage(img, 0, 0);
    const {top, left, width, height} = canvasRef.value.getBoundingClientRect();
    magnifier.value.width = originSize * zoom;
    magnifier.value.height = originSize * zoom;

    const mouseDownHandler = e => {
      // 相对于画布的坐标
      const center = {
        x: Math.floor(e.pageX - left),
        y: Math.floor(e.pageY - top)
      };
      // 待放大区域的imageData
      const originImageData = getImageData(img, [center.x - originSize / 2, center.y - originSize / 2, originSize, originSize]);
      // 构建一个imageData
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
      position.top = (center.y - originSize * zoom / 2) + 'px';
      position.left = (center.x - originSize * zoom / 2) + 'px';
    };

    const addEvent = () => {
      containerRef.value.addEventListener('mousemove', mouseDownHandler);
    };

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
  box-shadow: 0 0 10px 4px rgba(12, 12, 12, .5);
  border-radius: 50%;
}
</style>
