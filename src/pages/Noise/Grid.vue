<template>
  <h3>网格噪声</h3>
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
  {name: "基础使用"},
  {name: "生物细胞"},
  {name: "生物细胞（动态）"},
];
const checkedTab = ref(2);

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

  vec2 random2(vec2 st) {
    st = vec2(
      dot(st, vec2(127.1, 311.7)),
      dot(st, vec2(269.5, 183.3))
    );
    return fract(sin(st) * 43758.5453123); // x和y：0~1
  }

  void main() {
    vec2 st = vUv * 10.0;

    float d = 1.0;
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    vec2 p = random2(i_st); // 特征点
    d = distance(f_st, p);

    gl_FragColor.rgb = vec3(d);
    gl_FragColor.a = 1.0;
  }
`;
const fragment1 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  vec2 random2(vec2 st) {
    st = vec2(
      dot(st, vec2(127.1, 311.7)),
      dot(st, vec2(269.5, 183.3))
    );
    return fract(sin(st) * 43758.5453123); // x和y：0~1
  }

  void main() {
    vec2 st = vUv * 10.0;

    float d = 1.0;
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    for (int i = -1; i <= 1; i ++) {
      for (int j = -1; j <= 1; j ++) {
        vec2 neighbor = vec2(float(i), float(j)); // 坐标x和y：-1~1
        vec2 p = random2(i_st + neighbor); // 9个随机特征点在自身网格内的坐标（坐标x和y：0~1）
        // 当前点和9个随机特征点 最近的距离
        d = min(d, distance(f_st, neighbor + p)); // f_st（当前片元在自身网格内的坐标），neighbor+p（特征点相对片元所在网格的坐标，坐标X和Y：-1~2）
      }
    }

    gl_FragColor.rgb = vec3(d);
    gl_FragColor.a = 1.0;
  }
`;
const fragment2 = `
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
    return fract(sin(st) * 43758.5453123); // x和y：0~1
  }

  void main() {
    vec2 st = vUv * 10.0;

    float d = 1.0;
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    for (int i = -1; i <= 1; i ++) {
      for (int j = -1; j <= 1; j ++) {
        vec2 neighbor = vec2(float(i), float(j)); // 坐标x和y：-1~1
        vec2 p = random2(i_st + neighbor); // 9个随机特征点在自身网格内的坐标（坐标x和y：0~1）
        p = 0.5 + 0.5 * sin(uTime + 6.2831 * p); // 随时间动态变化（0~1）
        // 当前点和9个特征点 最近的距离
        d = min(d, distance(f_st, neighbor + p)); // neighbor+p（坐标X和Y：-1~2）
      }
    }

    gl_FragColor.rgb = vec3(d) + step(d, 0.03); // 显示特征点
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
