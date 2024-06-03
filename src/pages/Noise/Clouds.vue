<template>
  <h3>云雾效果</h3>
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

const tabs = [
  {name: "插值噪声"},
  {name: "梯度噪声"},
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
  uniform float uTime;

  float random(vec2 st) {
    return fract(
      sin(
        dot(st.xy, vec2(12.9898, 78.233))
      )
      *
      43758.5453123
    );
  }

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

const fragment1 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float uTime;

  vec2 random2(vec2 st) {
    st = vec2(
      dot(st, vec2(127.1, 311.7)),
      dot(st, vec2(269.5, 183.3))
    );
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123); // x和y：-1~1
  }

  // Gradient Noise by Inigo Quilez - iq/2013
  // https://www.shadertoy.com/view/XdXGW8
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f); // 0~1

    return mix(
      mix(
        dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)),
        u.x
      ),
      mix(
        dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)),
        u.x
      ),
      u.y
    );
  }

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
  }
  renderer.uniforms.uTime = 0.0;
  requestAnimationFrame(function update(t) {
    renderer.uniforms.uTime = 0.001 * t;
    requestAnimationFrame(update);
  })
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
