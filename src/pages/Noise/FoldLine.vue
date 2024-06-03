<template>
  <h3>实现噪声函数</h3>
  <div>
    <span
        class="filter-type"
        :class="{active: checkedTab === index}"
        @click="checkedTab = index"
        v-for="(item, index) in tabs">{{ item.name }}</span>
  </div>
  <canvas ref="glRef" width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import GlRenderer from "gl-renderer";

const tabs = [
  {name: "线段"},
  {name: "折线"},
  {name: "平滑的曲线"},
  {name: "二维噪声"},
];
const checkedTab = ref(0);

const glRef = ref(null);
const vertex = `
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`;
const fragment = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  // 随机函数
  float random (float x) {
    return fract(sin(x * 1243758.5453123));
  }

  void main() {
    vec2 st = vUv - vec2(0.5);
    st *= 10.0;
    float i = floor(st.x);
    float f = fract(st.x);

    // d直接等于随机函数返回值，这样d不连续
    float d = random(i); // 取出10个不同的'd'值(0~1)

    // st.y: -5 ~ +5
    // 1. d < st.y - 0.1 或 d > st.y + 0.1，值为0，为黑色（st.y > d+0.1 或 st.y < d-0.1）
    // 2. st.y - 0.1 < d < st.y + 0.1 时, 值为0->1->0，为黑到白再到黑的过渡色
    gl_FragColor.rgb = (smoothstep(st.y - 0.10, st.y, d) - smoothstep(st.y, st.y + 0.10, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
const fragment1 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  // 随机函数
  float random (float x) {
    return fract(sin(x * 1243758.5453123));
  }

  void main() {
    vec2 st = vUv - vec2(0.5);
    st *= 10.0;
    float i = floor(st.x);
    float f = fract(st.x);

    // mix(a,  b,  c)：线性插值函数。a和b是两个输入的颜色或值，c是一个介于0和1之间的浮点数，表示插值的权重
    // 当c接近0时，返回a；当c接近1时，mix函数返回b；当c在0和1之间时，返回a和b的插值结果。
    float d = mix(random(i), random(i + 1.0), f);

    gl_FragColor.rgb = (smoothstep(st.y - 0.10, st.y, d) - smoothstep(st.y, st.y + 0.10, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
const fragment2 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  // 随机函数
  float random (float x) {
    return fract(sin(x * 1243758.5453123));
  }

  void main() {
    vec2 st = vUv - vec2(0.5);
    st *= 10.0;
    float i = floor(st.x);
    float f = fract(st.x);

    // mix(a,  b,  c)：线性插值函数。a和b是两个输入的颜色或值，c是一个介于0和1之间的浮点数，表示插值的权重
    // 当c接近0时，返回a；当c接近1时，mix函数返回b；当c在0和1之间时，返回a和b的插值结果。
    float d = mix(random(i), random(i + 1.0), smoothstep(0.0, 1.0, f));
    // float d = mix(random(i), random(i + 1.0), f * f * (3.0 - 2.0 * f));

    gl_FragColor.rgb = (smoothstep(st.y - 0.10, st.y, d) - smoothstep(st.y, st.y + 0.10, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
const fragment3 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  float random(vec2 st) {
    return fract(
      sin(
        dot(st.xy, vec2(12.9898, 78.233))
      )
      *
      43758.5453123
    );
  }

  // 二维噪声，对st与方形区域的四个顶点插值
  highp float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f); // 0~1
    return mix(
      mix(random(i + vec2(0.0, 0.0)), random(i + vec2(1.0, 0.0)), u.x),
      mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec2 st = vUv * 20.0;
    gl_FragColor.rgb = vec3(noise(st));
    gl_FragColor.a = 1.0;
  }
`;

let renderer, program;
onMounted(() => {
  renderer = new GlRenderer(glRef.value);
  drawByTab(checkedTab.value);
  // 写数据并渲染
  bufferDataAndRender();

  watch(checkedTab, () => {
    drawByTab(checkedTab.value);
    // 写数据并渲染
    bufferDataAndRender();
  })
});

const drawByTab = tab => {
  switch (tab) {
    case 0:
      program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);
      break;
    case 1:
      program = renderer.compileSync(fragment1, vertex);
      renderer.useProgram(program);
      break;
    case 2:
      program = renderer.compileSync(fragment2, vertex);
      renderer.useProgram(program);
      break;
    case 3:
      program = renderer.compileSync(fragment3, vertex);
      renderer.useProgram(program);
      break;
  }
}

const bufferDataAndRender = () => {
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
  renderer.render();
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
