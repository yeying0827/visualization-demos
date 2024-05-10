<template>
  <h3>局部颜色控制</h3>
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
  {name: "纯黑"},
  {name: "由黑向白过渡"},
  {name: "过渡效果2"},
  {name: "过渡效果3"},
];

const checkedTab = ref(3);
const glRef = ref(null);

const vertex = `
  attribute vec2 a_vertexPosition;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
  }
`;
const fragment = `
  #ifdef GL_ES
  precision highp float;
  #endif

  void main() {
    gl_FragColor = vec4(0, 0, 0, 1);
  }
`;

const vertex1 = `
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    vUv = uv;
    gl_Position = vec4(a_vertexPosition, 1, 1);
  }
`;
const fragment1 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  void main() {
    gl_FragColor.rgb = vec3(vUv.x);
    gl_FragColor.a = 1.0;
  }
`;
const fragment2 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  void main() {
    vec2 st = vUv * 10.0;
    gl_FragColor.rgb = vec3(fract(st), 0.0); // r和g取坐标值，b为0
    gl_FragColor.a = 1.0;
  }
`;
const fragment3 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  void main() {
    vec2 st = vUv * 10.0;
    vec2 idx = floor(st); // 横纵坐标的整数部分（网格的索引）
    vec2 grid = fract(st); // 横纵坐标的小数部分

    // 在GLSL中，mod 函数是一个取模运算符，用于计算两个数值的除法运算的余数。
    vec2 t = mod(idx, 2.0);

    // 纹理坐标，左下角(0,0)，X轴向上 Y轴向右
    if (t.x == 1.0) { // 如果X轴方向索引是奇数，坐标反转
      grid.x = 1.0 - grid.x;
    }
    if (t.y == 1.0) { // 如果Y轴方向索引是奇数，坐标反转
      grid.y = 1.0 - grid.y;
    }
    gl_FragColor.rgb = vec3(grid, 0.0);
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

const drawByTab = value => {
  switch (value) {
    case 0:
      program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);
      break;
    case 1:
      program = renderer.compileSync(fragment1, vertex1);
      renderer.useProgram(program);
      break;
    case 2:
      program = renderer.compileSync(fragment2, vertex1);
      renderer.useProgram(program);
      break;
    case 3:
      program = renderer.compileSync(fragment3, vertex1);
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
