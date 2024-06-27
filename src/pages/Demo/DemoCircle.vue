<template>
  <h3>绘制圆形</h3>
  <p>WebGL</p>
  <canvas ref="webglRef" width="512" height="512"></canvas>
  <p>Canvas2D</p>
  <canvas ref="canvas2dRef" width="256" height="256"></canvas>
  <p>SVG</p>
  <svg class="svg-circle" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <circle cx="128" cy="128" r="100" stroke="orange" stroke-width="1" fill="transparent"></circle>
  </svg>
</template>

<script setup>
import {onMounted, ref} from "vue";
import WebGL from "../../utils/WebGL.js";

const canvas2dRef = ref(null);
const webglRef = ref(null);

onMounted(() => {
  canvasDrawCircle();
  // webglDrawCircle();
  webglDrawColor();
});

const canvasDrawCircle = () => {
  const ctx = canvas2dRef.value.getContext('2d');
  ctx.translate(canvas2dRef.value.width / 2, canvas2dRef.value.height / 2);
  ctx.scale(1, -1);

  ctx.beginPath();
  ctx.strokeStyle = "orange";
  ctx.arc(0, 0, 100, 0, Math.PI * 2);
  ctx.stroke();
}

const TAU_SEGMENTS = 60;
const TAU = Math.PI * 2;
// 获得圆形曲线顶点集合
function arc(x0, y0, radius, startAng = 0, endAng = Math.PI * 2) {
  const ang = Math.min(TAU, endAng - startAng);
  const ret = [];
  const segments = Math.round(TAU_SEGMENTS * ang / TAU);
  for (let i = 0; i <= segments; i ++) {
    const x = x0 + radius * Math.cos(startAng + ang * i / segments);
    const y = y0 + radius * Math.sin(startAng + ang * i / segments);
    ret.push([x, y]);
  }
  return ret;
}

const vertex = `
  attribute vec2 position;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(position, 1, 1);
  }
`;
const fragment = `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(0, 0, 0, 1);
  }
`;

const webglDrawCircle = () => {
  const vertices = arc(0, 0, 0.8);
  // gl.LINE_LOOP
  const gl = webglRef.value.getContext('webgl');
  const webgl = new WebGL(gl, vertex, fragment);
  webgl.drawSimple(vertices.flat(), 2, gl.LINE_LOOP);
}

const vertex1 = `
  attribute vec2 position;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(position, 1, 1);
  }
`;
const fragment1 = `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(0, 0, 0, 1);
  }
`;

const vertex2 = `
  attribute vec2 position;
  varying vec2 vP;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(position, 1, 1);
    vP = position;
  }
`;
const fragment2 = `
  #define PI 3.1415926535897932384626433832795
  precision mediump float;
  varying vec2 vP;

  // hsv -> rgb
  // 参数的取值范围都是 (0, 1)
  vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
  }

  void main() {
    float x0 = 0.0;
    float y0 = 0.0;
    float h = atan(vP.y - y0, vP.x - x0);
    h = h / (PI * 2.0); // 归一化的值
    float r = sqrt((vP.x - x0) * (vP.x - x0) + (vP.y - y0) * (vP.y - y0));
    vec3 hsv_color = vec3(h, r * 1.2, 1.0);
    vec3 rgb_color = hsv2rgb(hsv_color); // 转换为RGB颜色向量
    gl_FragColor = vec4(rgb_color, 1.0);
  }
`;

const webglDrawColor = () => {
  const vertices = arc(0, 0, 0.8);
  const gl = webglRef.value.getContext('webgl');
  const webgl = new WebGL(gl, vertex2, fragment2);
  webgl.drawPolygonTess2(vertices);
}
</script>

<style scoped>
.svg-circle {
  width: 256px;
  height: 256px;
}
</style>
