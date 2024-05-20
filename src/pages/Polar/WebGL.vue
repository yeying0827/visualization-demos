<template>
  <h3>WebGL demo</h3>
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
  {name: "圆"},
  {name: "玫瑰"},
  {name: "玫瑰花瓣数动态变化"},
  {name: "花瓣线"},
  {name: "横置的葫芦"},
  {name: "花苞图案"},
];

const checkedTab = ref(5);
const glRef = ref(null);

const toPolar = `
  vec2 polar(vec2 st) {
    return vec2(length(st), atan(st.y, st.x));
  }
`;
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

  ${toPolar}

  void main() {
    vec2 st = vUv - vec2(0.5);
    st = polar(st);
    gl_FragColor.rgb = smoothstep(st.x, st.x + 0.01, 0.2) * vec3(1.0);

    gl_FragColor.a = 1.0;
  }
`;
const fragment1 = ` // 三瓣玫瑰线
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${toPolar}

  void main() {
    vec2 st = vUv - vec2(0.5);
    st = polar(st);
    float d = 0.5 * cos(st.y * 3.0) - st.x;

    gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
const fragment2 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float u_k;

  ${toPolar}

  void main() {
    vec2 st = vUv - vec2(0.5);
    st = polar(st);
    float d = 0.5 * cos(st.y * u_k) - st.x;
    gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
const fragment3 = ` // 花瓣线
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${toPolar}

  void main() {
    // float u_k = 3.0; // 三片花瓣
    float u_k = 1.3; // 横放的苹果

    vec2 st = vUv - vec2(0.5);
    st = polar(st);
    float d = 0.5 * abs(cos(st.y * u_k * 0.5)) - st.x;
    gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
const fragment4 = ` // 横放的葫芦
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float u_k;
  uniform float u_scale;
  uniform float u_offset;

  ${toPolar}

  void main() {
    vec2 st = vUv - vec2(0.5);
    st = polar(st);
    float d = u_scale * 0.5 * abs(cos(st.y * u_k * 0.5)) - st.x + u_offset;
    gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
const fragment5 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  ${toPolar}

  varying vec2 vUv;
  uniform float u_k;
  uniform float u_scale;
  uniform float u_offset;

  void main() {
    vec2 st = vUv - vec2(0.5);
    st = polar(st);
    float d = smoothstep(-0.3, 1.0, u_scale * 0.5 * cos(st.y * u_k) + u_offset) - st.x;
    gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;

let renderer, program;

onMounted(() => {
  drawByTab(checkedTab.value);
  // 写数据并渲染
  bufferDataAndRender();

  watch(checkedTab, () => {
    drawByTab(checkedTab.value);
    // 写数据并渲染
    bufferDataAndRender();
  });
});

let timer = null;
const drawByTab = value => {
  clearInterval(timer);
  switch (value) {
    case 0:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);
      break;
    case 1:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment1, vertex);
      renderer.useProgram(program);
      break;
    case 2:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment2, vertex);
      renderer.useProgram(program);
      renderer.uniforms.u_k = 3;
      timer = setInterval(() => {
        renderer.uniforms.u_k += 2;
      }, 200);
      break;
    case 3:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment3, vertex);
      renderer.useProgram(program);
      break;
    case 4:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment4, vertex);
      renderer.useProgram(program);
      renderer.uniforms.u_k = 1.7;
      renderer.uniforms.u_scale = 0.5;
      renderer.uniforms.u_offset = 0.2;
      break;
    case 5:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment5, vertex);
      renderer.useProgram(program);
      renderer.uniforms.u_k = 5.0;
      renderer.uniforms.u_scale = 0.2;
      renderer.uniforms.u_offset = 0.2;
      break;
  }
}

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
