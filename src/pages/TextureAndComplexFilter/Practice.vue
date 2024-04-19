<template>
  <h3>课后练习（WebGL）</h3>
  <div>
    <span
        class="filter-type"
        :class="{active: checkedTab === index}"
        @click="checkedTab = index"
        v-for="(item, index) in tabs">{{ item.name }}</span>
  </div>
  <canvas ref="canvasRef" width="1000" height="554"></canvas>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import GlRenderer from "gl-renderer";
import {gaussianMatrix} from '../../utils/ImageHandler.js';
import girl1jpg from '@/assets/girl1.jpg';
import roomjpeg from '@/assets/room.jpeg';
import {multiply, flipMatrix, brightness, channel, saturate, grayscale} from "../../utils/webgl-color-matrix.js";

const tabs = [
  {name: "颜色滤镜函数"},
  {name: "平滑效果滤镜"},
  {name: "局部\"马赛克\""},
];

const checkedTab = ref(0);
const canvasRef = ref(null);

const vertex = `
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    vUv = uv;
    gl_Position = vec4(a_vertexPosition, 1, 1);
  }
`;
const fragment = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv; // 由顶点着色器传来的uv属性
  uniform sampler2D tMap;
  uniform mat4 colorMatrix;

  void main() {
    vec4 color = texture2D(tMap, vUv); // 从纹理中提取颜色，vUv是纹理坐标
    gl_FragColor = colorMatrix * vec4(color.rgb, 1.0); // 颜色变换
    gl_FragColor.a = color.a;
  }
`;
const fragment1 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float matrix[7];
  uniform float sum;
  uniform sampler2D tMap;

  void main() {
    vec2 st = vUv * vec2(1000, 554);
    const int r = 3;

    vec4 tmpColor1;
    for(int i = -r; i <= r; i ++) {
      tmpColor1 += matrix[i + r] * texture2D(tMap, vec2((st.x + float(i)) / 1000.0, vUv.y));
    }
    tmpColor1 = tmpColor1 / sum;

    vec4 tmpColor2;
    for(int i = -r; i <= r; i ++) {
      if (i == 0) tmpColor2 += matrix[i + r] * tmpColor1;
      else tmpColor2 += matrix[i + r] * texture2D(tMap, vec2(vUv.x, (st.y + float(i))/ 554.0));
    }
    tmpColor2 = tmpColor2 / sum;

    gl_FragColor = tmpColor2;
  }
`;
const fragment2 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform sampler2D tMap;
  uniform vec2 center;
  uniform float radiusX;
  uniform float radiusY;
  varying vec2 vUv;

  void main() {
    // 中心点坐标
    float x0 = center.x;
    float y0 = center.y;

    vec2 st = vUv * vec2(50, 27.7);
    // vec2 st = vUv * vec2(100, 55.4);
    vec2 uv = floor(st);

    vec4 color;
    // if (pow(abs(vUv.x - x0), 2.0) / pow(0.05, 2.0) + pow(abs(vUv.y - y0), 2.0) / pow(0.09, 2.0) <= 1.0) {
    // if (pow(abs(vUv.x - x0), 2.0) / pow(0.08, 2.0) + pow(abs(vUv.y - y0), 2.0) / pow(0.15, 2.0) <= 1.0) {
    if (pow(abs(vUv.x - x0), 2.0) / pow(radiusX, 2.0) + pow(abs(vUv.y - y0), 2.0) / pow(radiusY, 2.0) <= 1.0) {
      color = texture2D(tMap, vec2(uv.x / 50.0, uv.y / 27.7));
      // color = texture2D(tMap, vec2(uv.x / 100.0, uv.y / 55.4));
    } else {
      color = texture2D(tMap, vUv);
    }

    gl_FragColor.rgb = color.rgb;
    gl_FragColor.a = color.a;
  }
`;

let renderer, program;
onMounted(() => {
  // 创建Renderer对象
  renderer = new GlRenderer(canvasRef.value);
  drawByTab(checkedTab.value);
  // 写数据并渲染
  bufferDataAndRender();

  watch(checkedTab, () => {
    drawByTab(checkedTab.value);
    // 写数据并渲染
    bufferDataAndRender();
  });
});
const drawByTab = async tab => {
  let texture;
  switch (tab) {
    case 0:
      // 创建并启用WebGL程序
      program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);
      // 设置uniform变量
      texture = await renderer.loadTexture(girl1jpg);
      renderer.uniforms.tMap = texture;
      // 设置变换矩阵
      const matrixArray = [
          channel({r: 1.2}),  // 增强红色通道
          brightness(1.2), // 增强亮度
          saturate(1.2), // 增强饱和度
        ];
      let colorMatrix = matrixArray.reduce((prev, current) => multiply(prev, current));
      colorMatrix = flipMatrix(colorMatrix);
      renderer.uniforms.colorMatrix = colorMatrix;
      break;
    case 1:
      // 创建并启用WebGL程序
      program = renderer.compileSync(fragment1, vertex);
      renderer.useProgram(program);
      // 设置uniform变量
      texture = await renderer.loadTexture(girl1jpg);
      renderer.uniforms.tMap = texture;
      const gaussianSetting = gaussianMatrix(3);
      renderer.uniforms.matrix = gaussianSetting.matrix;
      renderer.uniforms.sum = gaussianSetting.sum;
      renderer.uniforms.radius = 3;
      break;
    case 2:
      // 创建并启用WebGL程序
      program = renderer.compileSync(fragment2, vertex);
      renderer.useProgram(program);
      // 设置uniform变量
      texture = await renderer.loadTexture(roomjpeg);
      renderer.uniforms.tMap = texture;
      const radiusPX = 100;
      renderer.uniforms.radiusX = radiusPX / canvasRef.value.width;
      renderer.uniforms.radiusY = radiusPX / canvasRef.value.height;
      renderer.uniforms.center = [-2.0, -2.0];
      addEvent();
      break;
  }
};

const bufferDataAndRender = () => {
  // 将顶点数据写入缓冲区
  // !!切换着色器之后要重新绑定缓冲区，否则会报vertex缓存空间不足
  renderer.setMeshData([{
    positions: [
      [-1, -1],
      [-1, 1],
      [1, 1],
      [1, -1]
    ],
    attributes: {
      uv: [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0]
      ]
    },
    cells: [
      [0, 1, 2],
      [2, 0, 3]
    ]
  }]);
  // 执行渲染
  renderer.render();
}

const clickHandler = e => {
  e.preventDefault();
  const {width, height} = canvasRef.value.getBoundingClientRect();
  const {offsetX: x, offsetY: y} = e;
  // 转换为纹理坐标上的值
  const center = [];
  center[0] = x / width;
  center[1] = (height - y) / height;
  renderer.uniforms.center = center;
};

const addEvent = () => {
  canvasRef.value.addEventListener('click', clickHandler);
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
