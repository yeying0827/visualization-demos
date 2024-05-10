<template>
  <h3>符号距离场（Signed Distance Field，SDF）</h3>
  <p>符号距离场的主要作用是快速查询任意一点到场景中物体表面的最短距离。</p>
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
  {name: "平行线"},
  {name: "斜线纹"},
  {name: "圆环"},
  {name: "三角环"},
];

const checkedTab = ref(3);
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

  void main() {
    vec3 line = vec3(1, 1, 0);
    float d = abs(
      cross(vec3(vUv, 0), normalize(line)).z
    );
    // smoothstep(0.195, 0.2, d)
    // 距离直线距离小于0.195的点 => 0           距离直线距离大于0.2的点 => 1
    // smoothstep(0.2, 0.205, d)
    // 距离直线距离小于0.2的点 => 0              距离直线距离大于0.205的点 => 1

    // (smoothstep(0.195, 0.2, d) - smoothstep(0.2, 0.205, d))
    // 距离小于0.195       => 0
    // 距离大于0.195小于0.2 => 0~1插值
    // 距离等于0.2         => 1
    // 距离大于0.2小于0.205 => 1 - 0~1插值
    // 距离大于0.205       => 0
    gl_FragColor.rgb = (smoothstep(0.195, 0.2, d) - smoothstep(0.2, 0.205, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
const fragment1 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  void main() {
    vec3 line = vec3(1, 1, 0);
    float d = abs(
      cross(vec3(vUv, 0), normalize(line)).z
    );
    d = fract(20.0 * d); // 距离放大20倍，再取小数部分

    // smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)
    // 距离小于0.45       => 0
    // 距离大于0.45小于0.5 => 0~1插值
    // 距离等于0.5         => 1
    // 距离大于0.5小于0.55 => 1 - 0~1插值
    // 距离大于0.55       => 0

    // 0.025 0.025x3(0.075) 0.025x5(0.125) ...
    gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
const fragment2 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  void main() {
    float d = distance(vUv, vec2(0.5)); // 距离圆心的距离
    d = fract(20.0 * (d));
    gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
    // gl_FragColor.rgb = vec3(d);
    gl_FragColor.a = 1.0;
  }
`;
const fragment3 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  float line_distance(in vec2 st, in vec2 a, in vec2 b) {
    vec3 ab = vec3(b - a, 0);
    vec3 p = vec3(st - a, 0);
    float l = length(ab);
    return cross(p, normalize(ab)).z;
  }

  float seg_distance(in vec2 st, in vec2 a, in vec2 b) {
    vec3 ab = vec3(b - a, 0);
    vec3 p = vec3(st - a, 0);
    float l = length(ab);
    float d = abs(cross(p, normalize(ab)).z);
    float proj = dot(p, ab) / l;
    if(proj >= 0.0 && proj <= l) return d;
    return min(distance(st, a), distance(st, b));
  }

  float triangle_distance(in vec2 st, in vec2 a, in vec2 b, in vec2 c) {
    float d1 = line_distance(st, a, b);
    float d2 = line_distance(st, b, c);
    float d3 = line_distance(st, c, a);

    if ((d1 >= 0.0 && d2 >= 0.0 && d3 >= 0.0)
        || (d1 <= 0.0 && d2 <= 0.0 && d3 <= 0.0)) {
      return -min(abs(d1), min(abs(d2), abs(d3))); // 内部距离为负
    }

    return min(seg_distance(st, a, b), min(seg_distance(st, b, c), seg_distance(st, c, a))); // 外部距离为正
  }

  void main() {
    float d = triangle_distance(vUv, vec2(0.3), vec2(0.5, 0.7), vec2(0.7, 0.3));
    // fract(float x) : x 减去整数部分，即可得到小数部分  x - floor(x) => 负数：1-x的小数部分
    // floor(-0.1) = -1  ==>  fract(-0.1) = -0.1 - (-1) = 0.9

    d = fract(20.0 * abs(d)); // if 20.0 * abs(d):0.5 => 原d:0.025 或 -0.025
    // 内部画两个三角形（垂心 -> 数量：两个）

    // d = fract(20.0 * d);   // if 20.0 * d: ±0.5     => 原d:0.025 或 -0.025
                              // if 20.0 * d: ±1.5     => 原d:0.075 或 -0.075
                              // if 20.0 * d: ±2.5     => 原d:0.125
                              // if 20.0 * d: ±3.5     => 原d:0.175

    // gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
    gl_FragColor.rgb = vec3(d);

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

const drawByTab = value => {
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
      break;
    case 3:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment3, vertex);
      renderer.useProgram(program);
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
};

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
