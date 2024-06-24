<template>
  <h3>非固定帧动画</h3>
  <div>
    <span
        class="filter-type"
        :class="{active: checkedTab === index}"
        @click="checkedTab = index"
        v-for="(item, index) in tabs">{{ item.name }}</span>
  </div>
  <canvas width="512" height="512" ref="glRef"></canvas>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import GlRenderer from "gl-renderer";
import {Animator} from "../../utils/animation.js";
import {color, noise} from "../../utils/glslFunc.js";

const tabs = [
  {name: "顶点着色器"},
  {name: "顶点着色器-Animator"},
  {name: "片元着色器-基础"},
  {name: "片元着色器-重复"},
];

const checkedTab = ref(2);
const glRef = ref(null);
const vertex = `
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  uniform float rotation;

  void main() {
    gl_PointSize = 1.0;
    float c = cos(rotation);
    float s = sin(rotation);
    mat3 transformMatrix = mat3(
      c,  s, 0,
      -s, c, 0,
      0,  0, 1
    );
    vec3 pos = transformMatrix * vec3(a_vertexPosition, 1); // 映射新的坐标
    gl_Position = vec4(pos, 1);
  }
`;
const fragment = `
  #ifdef GL_ES
  precision highp float;
  #endif

  void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
  }
`;

const vertex1 = `
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`;
const fragment1 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform vec4 color;
  uniform float rotation;

  void main() {
    vec2 st = 2.0 * (vUv - vec2(0.5));
    float c = cos(rotation);
    float s = sin(rotation);
    mat3 transformMatrix = mat3(
      c, s, 0,
      -s, c, 0,
      0, 0, 1
    );
    vec3 pos = transformMatrix * vec3(st, 1.0); // 坐标系旋转
    float d1 = 1.0 - smoothstep(0.5, 0.505, abs(pos.x)); // abs(x)<0.5 d1=1
    float d2 = 1.0 - smoothstep(0.5, 0.505, abs(pos.y)); // abs(y)<0.5 d2=1
    gl_FragColor = d1 * d2 * color;
  }
`;
const fragment2 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float rotation;

  ${noise.random2d}
  ${color.hsb}

  void main() {
    vec2 f_uv = fract(vUv * 10.0);
    vec2 i_uv = floor(vUv * 10.0);
    vec2 st = 2.0 * (f_uv - vec2(0.5));
    float c = 0.7 * cos(rotation);
    float s = 0.7 * sin(rotation);
    mat3 transformMatrix = mat3(
      c, s, 0,
      -s, c, 0,
      0, 0, 1
    );
    vec3 pos = transformMatrix * vec3(st, 1.0);
    float d1 = 1.0 - smoothstep(0.5, 0.505, abs(pos.x));
    float d2 = 1.0 - smoothstep(0.5, 0.505, abs(pos.y));
    gl_FragColor = d1 * d2 * vec4(hsb2rgb(vec3(random(i_uv), 1.0, 1.0)), 1.0);
  }
`;
let renderer, program;
onMounted(() => {
  renderer = new GlRenderer(glRef.value);
  drawByTab(checkedTab.value);

  watch(checkedTab, () => {
    drawByTab(checkedTab.value);
  });
});

const drawByTab = value => {
  switch (value) {
    case 0:
      program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);
      renderer.uniforms.rotation = 0.0;
      requestAnimationFrame(function update() {
        renderer.uniforms.rotation += 0.05;
        requestAnimationFrame(update);
      });
      // 写数据并渲染
      bufferDataAndRender({
        positions: [
            [-0.5, -0.5],
            [-0.5, 0.5],
            [0.5, 0.5],
            [0.5, -0.5]
        ]
      });
      break;
    case 1:
      program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);
      renderer.uniforms.rotation = 0.0;
      const animator = new Animator({duration: 2000, iterations: Infinity});
      animator.animate(renderer, ({target, timing}) => {
        target.uniforms.rotation = timing.p * 2 * Math.PI;
      });
      // 写数据并渲染
      bufferDataAndRender({
        positions: [
          [-0.5, -0.5],
          [-0.5, 0.5],
          [0.5, 0.5],
          [0.5, -0.5]
        ]
      });
      break;
    case 2:
      program = renderer.compileSync(fragment1, vertex1);
      renderer.useProgram(program);
      renderer.uniforms.color = [1, 0, 0, 1];
      renderer.uniforms.rotation = 0.0;
      requestAnimationFrame(function update() {
        renderer.uniforms.rotation += 0.05;
        requestAnimationFrame(update);
      });
      // 写数据并渲染
      bufferDataAndRender({});
      break;
    case 3:
      program = renderer.compileSync(fragment2, vertex1);
      renderer.useProgram(program);
      renderer.uniforms.color = [1, 0, 0, 1];
      renderer.uniforms.rotation = 0.0;
      requestAnimationFrame(function update() {
        renderer.uniforms.rotation += 0.05;
        requestAnimationFrame(update);
      });
      // 写数据并渲染
      bufferDataAndRender({});
      break;
  }
}

const bufferDataAndRender = ({
    positions = [
      [-1, -1],
      [-1, 1],
      [1, 1],
      [1, -1]
    ]
}) => {
  // 将顶点数据写入缓冲区
  // !!切换着色器之后要重新绑定缓冲区，否则会报vertex缓存空间不足
  renderer.setMeshData([{
    positions: positions,
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
