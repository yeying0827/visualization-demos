<template>
  <h3>WebGL局部"马赛克"</h3>
  <canvas ref="canvasRef" width="1000" height="554"></canvas>
</template>

<script setup>
import {onMounted, ref} from "vue";
import GlRenderer from "gl-renderer";
import roomjpeg from '@/assets/room.jpeg';

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

    vec2 st = vUv * vec2(50, 27.7); // 20 x 20
    vec2 uv = floor(st);

    vec4 color;
    // if(pow(abs(vUv.x - x0), 2.0) / pow(radiusX, 2.0) + pow(abs(vUv.y - y0), 2.0) / pow(radiusY, 2.0) <= 1.0){
    if(abs(vUv.x - x0) < radiusX && abs(vUv.y - y0) < radiusY){
      color = texture2D(tMap, vec2(uv.x / 50.0, uv.y / 27.7));
    } else {
      color = texture2D(tMap, vUv);
    }

    gl_FragColor.rgb = color.rgb;
    gl_FragColor.a = color.a;
  }
`;

let renderer, program;
onMounted(async () => {
  // 创建Renderer对象
  renderer = new GlRenderer(canvasRef.value);

  // 创建并启用WebGL程序
  program = renderer.compileSync(fragment2, vertex);
  renderer.useProgram(program);
  // 设置uniform变量
  let texture = await renderer.loadTexture(roomjpeg);
  renderer.uniforms.tMap = texture;
  renderer.uniforms.center = [-2.0, -2.0];
  const radiusPX = 100;
  renderer.uniforms.radiusX = radiusPX / canvasRef.value.width;
  renderer.uniforms.radiusY = radiusPX / canvasRef.value.height;

  // 写数据并渲染
  bufferDataAndRender();
  addEvent();
});

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
  const center = [];
  center[0] = x / width;
  center[1] = (height - y) / height;
  renderer.uniforms.center = center;
};

const addEvent = () => {
  canvasRef.value.addEventListener('click', clickHandler);
}

</script>
