<template>
  <h3>课后练习</h3>
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
import {distance} from "../../utils/glslFunc.js";

const tabs = [
  {name: "正方形"},
  {name: "正六边形"},
  {name: "椭圆"},
  {name: "正方形环"},
  {name: "正六边形环"},
  {name: "椭圆环"},
  {name: "正六角星"},
  {name: "正六角星环"},
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
// 正方形
const fragment = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${distance.base}

  ${distance.square}

  void main() {
    float d = square_distance(
      vUv,
      vec2(0.3, 0.3),
      vec2(0.3, 0.7),
      vec2(0.7, 0.7),
      vec2(0.7, 0.3)
    );
    gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
// 正六边形
const fragment1 = `
  #define PI 3.1415926535897932384626433832795
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${distance.base}

  ${distance.polygon}

  void main() {
    // float d = polygon_distance(
    //   vUv,
    //   6,
    //   vec2(0.65, 0.25), // 起始点（右下角）
    //   0.3
    // );

    float d = polygon_distance2(
      vUv - vec2(0.5), // 以圆心坐标计算出的色值，给(0.5,0.5)坐标上色，相当于将图形向右上方挪动
      6,
      // vec2(0.13, 0.05)
      vec2(0.2, 0.0) // 起始点
    );

    gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
// 椭圆
const fragment2 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${distance.ellipse}

  void main() {
    float d = ellipse_distance(
      vUv,
      vec2(0.5, 0.5),
      0.4,
      0.2
    );
    gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.03, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
// 正方形环
const fragment3 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${distance.base}

  ${distance.square}

  void main() {
    float d = square_distance(
      vUv,
      vec2(0.3, 0.3),
      vec2(0.3, 0.7),
      vec2(0.7, 0.7),
      vec2(0.7, 0.3)
    );

    // d = fract(20.0 * abs(d));
    // gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
    // gl_FragColor.a = 1.0;

    // // d = fract(20.0 * abs(d)); // 内部距离近-远：黑->白(0->1)
    // d = fract(20.0 * d); // 内部距离近-远：白-> 黑(1->0)
    // gl_FragColor.rgb = vec3(d);
    // gl_FragColor.a = 1.0; // 1不透明

    gl_FragColor.rgb = vec3(0.0);
    gl_FragColor.a = 1.0 - fract(abs(d) * 64.0); // 内部距离近-远：(0->1) => 透明度：1->0(不透明->透明)
    // gl_FragColor.a = 1.0 - fract(d * 64.0); // 内部距离近-远：(1->0) => 透明度：0->1(透明->不透明)
  }
`;
// 正六边形环
const fragment4 = `
    #define PI 3.1415926535897932384626433832795
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${distance.base}

  ${distance.polygon}

  void main() {
    // float d = polygon_distance(
    //   vUv,
    //   6,
    //   vec2(0.65, 0.25), // 起始点（右下角）
    //   0.3
    // );

    float d = polygon_distance2(
      vUv - vec2(0.5), // 以圆心坐标计算出的色值，给(0.5,0.5)坐标上色，相当于将图形向右上方挪动
      6,
      // vec2(0.13, 0.05)
      vec2(0.2, 0.0) // 起始点
    );

    d = fract(20.0 * d);
    gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
// 椭圆环
const fragment5 = `
  #define PI 3.1415926535897932384626433832795
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  ${distance.ellipse}

  void main() {
    float d = ellipse_distance2(
      vUv,
      vec2(0.5, 0.5),
      0.35,
      0.2
    );
    d = fract(20.0 * abs(d));
    // gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);

    gl_FragColor.rgb = vec3(d);

    // gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);

    gl_FragColor.a = 1.0;
  }
`;
// 正六角星
const fragment6 = `
  #define PI 3.1415926535897932384626433832795
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${distance.base}

  ${distance.star}

  void main() {
    float d = star_distance(
      vUv - vec2(0.5), // 以圆心坐标计算出的色值，给(0.5,0.5)坐标上色，相当于将图形向右上方挪动
      6,
      // vec2(0.13, 0.05)
      vec2(0.2, 0.0) // 起始点
    );

    gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
// 正六角星环
const fragment7 = `
  #define PI 3.1415926535897932384626433832795
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${distance.base}

  ${distance.star}

  void main() {
    float d = star_distance(
      vUv - vec2(0.5), // 以圆心坐标计算出的色值，给(0.5,0.5)坐标上色，相当于将图形向右上方挪动
      6,
      // vec2(0.13, 0.05)
      vec2(0.2, 0.0) // 起始点
    );

    d = fract(20.0 * abs(d));
    gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
    // gl_FragColor.rgb = vec3(d);
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
    case 4:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment4, vertex);
      renderer.useProgram(program);
      break;
    case 5:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment5, vertex);
      renderer.useProgram(program);
      break;
    case 6:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment6, vertex);
      renderer.useProgram(program);
      break;
    case 7:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment7, vertex);
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
