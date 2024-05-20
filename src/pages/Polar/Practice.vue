<template>
  <h3>Practice</h3>
  <div>
    <span
        class="filter-type"
        :class="{active: checkedTab === index}"
        @click="checkedTab = index"
        v-for="(item, index) in tabs">{{ item.name }}</span>
  </div>
  <template v-if="checkedTab === 2">
    <p>CSS</p>
    <div class="conic"></div>
  </template>
  <canvas ref="glRef" width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import GlRenderer from "gl-renderer";
import {distance} from "../../utils/glslFunc.js";

const tabs = [
  {name: "苹果"},
  {name: "葫芦"},
  {name: "角向渐变"},
  {name: "剪纸图案"},
];

const checkedTab = ref(3);
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
const fragment = ` // 苹果
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
    st.y += 3.14 / 2.0;
    // atan 的返回值是：从第一到第二象限为 0~PI，从第三到第四象限为 -PI~0
    // 旋转极坐标后要保证函数定义域的一致性
    if (st.y > 3.14) st.y -= 3.14 * 2.0;
    float d = 0.5 * abs(cos(st.y * u_k * 0.5)) - st.x;
    gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
const fragment1 = ` // 横放的葫芦
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
    st.y += 3.14 / 2.0;
    if (st.y > 3.14) st.y -= 3.14 * 2.0;
    float d = u_scale * 0.5 * abs(cos(st.y * u_k * 0.5)) - st.x + u_offset;
    gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
const fragment2 = `// 角向渐变
  #ifdef GL_ES
  precision highp float;
  #endif

  ${toPolar}

  varying vec2 vUv;

  void main() {
    vec2 st = vUv;
    // 直角坐标系下操作
    st.x = 1.0 - st.x; // 将X坐标沿x=0.5翻转
    st = st - vec2(0.5);
    // 极坐标系下操作
    st = polar(st);
    st.y -= 3.14 / 2.0; // 将角度旋转90度
    // 以上操作完成后，直角坐标系的X轴变为Y轴，Y轴变为X轴
    float d = smoothstep(st.x, st.x + 0.01, 0.2); // st.x：半径；st.x > 0.2时，d为0
    // 将角度范围转换到0到2PI之间
    if(st.y < 0.0) st.y += 2.0 * 3.14;
    // 计算p，角度归一化后的值
    float p = st.y / (2.0 * 3.14);
    if (p < 0.45) {
      // 0-0.45时，从红色线性过渡到绿色
      gl_FragColor.rgb = d * mix(vec3(1.0, 0, 0), vec3(0, 0.5, 0), p / 0.45);
    } else {
      // >0.45，从绿色过渡到蓝色
      gl_FragColor.rgb = d * mix(vec3(0, 0.5, 0), vec3(0, 0, 1.0), (p - 0.45) / (1.0 - 0.45));
    }
    gl_FragColor.a = smoothstep(st.x, st.x + 0.01, 0.2); // 0-透明 1-不透明；st.x > 0.2时，a为0
  }
`;
const fragment3 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  #define PI 3.1415926

  varying vec2 vUv;

  ${toPolar}

  ${distance.base}
  ${distance.polygon}
  ${distance.star}

  float random(vec2 st) {
    return fract(
      sin(
        dot(st.xy, vec2(12.9898, 78.233))
      ) *
      43758.5453123
    );
  }

  void main() {
    vec2 st = vUv * 10.0;
    vec2 ipos = floor(st); // integer
    vec2 fpos = fract(st); // fraction

    float r = random(ipos);

    float d = 0.0;
    if(r < 0.14) { // 四边形
      fpos = fpos - vec2(0.5);
       float d = polygon_distance2(
          fpos,
          4,
          vec2(0.0, 0.4)
       );
       gl_FragColor.rgb = smoothstep(0.01, 0.0, d) * vec3(1.0, 0.0, 0.0);
       gl_FragColor.a = smoothstep(0.01, 0.0, d);
    } else if (r < 0.28) { // 四片花瓣
      float u_k = 4.0;

      fpos = fpos - vec2(0.5);
      fpos = polar(fpos);
      d = 0.5 * abs(cos(fpos.y * u_k * 0.5)) - fpos.x;
      gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0, 0.0, 0.0);
      gl_FragColor.a = smoothstep(-0.01, 0.01, d);
    } else if (r < 0.42) { // 苹果
      float u_k = 1.3;

      fpos = fpos - vec2(0.5, 0.7);
      fpos = polar(fpos);
      fpos.y += 3.14 / 2.0;
      // atan 的返回值是：从第一到第二象限为 0~PI，从第三到第四象限为 -PI~0
      // 旋转极坐标后要保证函数定义域的一致性
      if (fpos.y > 3.14) fpos.y -= 3.14 * 2.0;
      float d = 0.5 * abs(cos(fpos.y * u_k * 0.5)) - fpos.x;
      gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0, 0.0, 0.0);
      gl_FragColor.a = smoothstep(-0.01, 0.01, d);
    } else if (r < 0.56) { // 六边形
       fpos = fpos - vec2(0.5);
       float d = polygon_distance2(
          fpos,
          6,
          vec2(0.0, 0.4)
       );
       gl_FragColor.rgb = smoothstep(0.01, 0.0, d) * vec3(1.0, 0.0, 0.0);
       gl_FragColor.a = smoothstep(0.01, 0.0, d);
    } else if (r < 0.70) { // 五角星
      fpos = fpos - vec2(0.5);
      float d = star_distance(
        fpos,
        5,
        vec2(0.15, 0.2)
      );
      gl_FragColor.rgb = smoothstep(0.01, 0.0, d) * vec3(1.0, 0.0, 0.0);
      gl_FragColor.a = smoothstep(0.01, 0.0, d);
    } else if (r < 0.84) { // 葫芦
      float u_k = 1.7;
      float u_scale = 0.5;
      float u_offset = 0.2;

      fpos = fpos - vec2(0.5);
      fpos = polar(fpos);
      fpos.y += 3.14 / 2.0;
      if (fpos.y > 3.14) fpos.y -= 3.14 * 2.0;
      float d = u_scale * 0.5 * abs(cos(fpos.y * u_k * 0.5)) - fpos.x + u_offset;
      gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0, 0.0, 0.0);
      gl_FragColor.a = smoothstep(-0.01, 0.01, d);
    } else { // 花苞
      float u_k = 5.0;
      float u_scale = 0.13;
      float u_offset = 0.2;

      fpos = fpos - vec2(0.5);
      fpos = polar(fpos);
      float d = smoothstep(-0.3, 1.0, u_scale * 0.5 * cos(fpos.y * u_k) + u_offset) - fpos.x;
      gl_FragColor.rgb = smoothstep(-0.01, 0.01, d) * vec3(1.0, 0.0, 0.0);
      gl_FragColor.a = smoothstep(-0.01, 0.01, d);
    }
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
    case 0: // 苹果
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);
      break;
    case 1: // 葫芦
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment1, vertex);
      renderer.useProgram(program);
      renderer.uniforms.u_k = 1.7;
      renderer.uniforms.u_scale = 0.5;
      renderer.uniforms.u_offset = 0.2;
      break;
    case 2: // 角向渐变
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment2, vertex);
      renderer.useProgram(program);
      break;
    case 3: // 剪纸图案
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

.conic {
 margin: auto;
 width: 150px;
 height: 150px;
 border-radius: 50%;
 background: conic-gradient(red 0%, green 45%, blue);
}
</style>
