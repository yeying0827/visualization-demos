<template>
  <h3>使用噪声生成纹理</h3>
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
import {onMounted, ref, watch} from 'vue';
import GlRenderer from "gl-renderer";
import { noise } from '../../utils/glslFunc.js';

const tabs = [
  {name: "插值噪声Value Noise一维"},
  {name: "插值噪声Value Noise二维"},
  {name: "梯度噪声Gradient Noise"},
  {name: "云雾效果"},
  {name: "Simplex Noise"},
  {name: "网格噪声"},
];
const checkedTab = ref(5);

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

  ${noise.random}

  void main() {
    vec2 st = vUv - vec2(0.5);
    st *= 10.0;
    float i = floor(st.x);
    float f = fract(st.x);

    // d直接等于随机函数返回值，这样d不连续
    // float d = random(i); // 取出10个不同的'd'值(0~1)
    float d = mix(random(i), random(i+1.0), f); // 取出10个不同的'd'值(0~1)

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

  ${noise.random2d}
  ${noise.noise_value}

  void main() {
    vec2 st = vUv * 20.0;
    gl_FragColor.rgb = vec3(noise(st));
    gl_FragColor.a = 1.0;
  }
`;
const fragment2 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${noise.noise_gradient}

  void main() {
    vec2 st = vUv * 20.0;
    gl_FragColor.rgb = vec3(0.5 * noise(st) + 0.5);
    gl_FragColor.a = 1.0;
  }
`;
const fragment3 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float uTime;

  ${noise.random2d}
  ${noise.noise_value}

  // Function from Inigo Quiles
  vec3 hsb2rgb(vec3 c) {
    vec3 rgb = clamp(
      abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
      0.0,
      1.0
    );
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
  }

  #define OCTAVES 6
  float mist(vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = 0.5;

    // 叠加6次
    for(int i = 0; i < OCTAVES; i ++) {
      // 每次范围扩大一倍，权重减半
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  // 配合色相的变化

  void main() {
    vec2 st = vUv;
    st.x += 0.1 * uTime;
    gl_FragColor.rgb = hsb2rgb(vec3(mist(st), 1.0, 1.0));
    gl_FragColor.a = 1.0;
  }
`;
const fragment4 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${noise.noise_simplex}

  void main() {
    vec2 st = vUv * 20.0;
    gl_FragColor.rgb = vec3(0.5 * noise(st) + 0.5);
    gl_FragColor.a = 1.0;
  }
`;
const fragment5 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float uTime;

  ${noise.random2vec}

  void main() {
    vec2 st = vUv * 10.0;

    float d = 1.0;
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    for (int i = -1; i <= 1; i ++) {
      for (int j = -1; j <= 1; j ++) {
        vec2 neighbor = vec2(float(i), float(j));
        vec2 p = random2vec(i_st + neighbor); // 特征点
        p = 0.5 + 0.5 * sin(uTime + 6.2831*p);
        d = min(d, distance(f_st, neighbor + p));
      }
    }


    gl_FragColor.rgb = vec3(d) + step(d, 0.03);
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
  });
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
      renderer.uniforms.uTime = 0.0;
      requestAnimationFrame(function update(t) {
        renderer.uniforms.uTime = 0.001 * t;
        requestAnimationFrame(update);
      });
      break;
    case 4:
      program = renderer.compileSync(fragment4, vertex);
      renderer.useProgram(program);
      break;
    case 5:
      program = renderer.compileSync(fragment5, vertex);
      renderer.useProgram(program);
      renderer.uniforms.uTime = 0.0;
      requestAnimationFrame(function update(t) {
        renderer.uniforms.uTime = 0.001 * t;
        requestAnimationFrame(update);
      });
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
    cells: [[0, 1, 2], [2, 0, 3]]
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
