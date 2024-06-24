<template>
  <h3>在着色器中实现缓动函数</h3>
  <div>
    <span
        class="filter-type"
        :class="{active: checkedTab === index}"
        @click="checkedTab = index"
        v-for="(item, index) in tabs">{{ item.name }}</span>
  </div>
  <canvas width="512" height="512" ref="glRef" style="background-color: #eee;"></canvas>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import GlRenderer from "gl-renderer";
import {Animator} from "../../utils/animation.js";
import {bezier, color} from "../../utils/glslFunc.js";

const tabs = [
  {name: "匀速运动-Animator"},
  {name: "缓动函数-Vertex Shader"},
  {name: "线性插值-Fragment Shader"},
  {name: "非线性插值-Fragment Shader"},
  {name: "非线性插值-bezier"},
];

const checkedTab = ref(4);

const glRef = ref(null);
const vertex = `
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  uniform vec2 translation;

  void main() {
    gl_PointSize = 1.0;
    mat3 transformMatrix = mat3(
      1, 0, 0,
      0, 1, 0,
      translation, 1
    );
    vec3 pos = transformMatrix * vec3(a_vertexPosition, 1);
    gl_Position = vec4(pos, 1);
  }
`;
const fragment = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform vec4 color;

  void main() {
    gl_FragColor = color;
  }
`;

const vertex1 = `
  attribute vec2 a_vertexPosition;
  uniform vec4 uFromTo;
  uniform float uTime;

  float easing(in float p) {
    // return smoothstep(0.0, 1.0, p);
    // return clamp(p * p, 0.0, 1.0); // 匀加速

    return clamp(p * (2.0 - p), 0.0, 1.0); // 0->1->0 // 先减速后加速

    // if(p < 1.0) return clamp(p * (2.0 - p), 0.0, 1.0);
    // else return 1.0;
  }

  void main() {
    gl_PointSize = 1.0;
    vec2 from = uFromTo.xy;
    vec2 to = uFromTo.zw;
    float p = easing(uTime / 2.0);
    vec2 translation = mix(from, to, p);
    mat3 transformMatrix = mat3(
      1, 0, 0,
      0, 1, 0,
      translation, 1
    );
    vec3 pos = transformMatrix * vec3(a_vertexPosition, 1);
    gl_Position = vec4(pos, 1);
  }
`;

const vertex2 = `
  attribute vec2 a_vertexPosition;
  attribute vec4 color;

  varying vec4 vColor;

  void main() {
    gl_PointSize = 1.0;
    vColor = color;
    gl_Position = vec4(a_vertexPosition, 1, 1);
  }
`;
const fragment2 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec4 vColor;

  void main() {
    gl_FragColor = vColor;
  }
`;

const fragment3 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  float easing(in float p) {
    return smoothstep(0.0, 1.0, p);
    // return clamp(p * p, 0.0, 1.0);
    // return clamp(p * (2.0 - p), 0.0, 1.0);
  }

  varying vec2 vUv;
  uniform vec4 fromColor;
  uniform vec4 toColor;

  void main() {
    float d = easing(vUv.x);
    gl_FragColor = mix(fromColor, toColor, d);
  }
`;
const vertex3 = `
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;

  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    vUv = uv;
    gl_Position = vec4(a_vertexPosition, 1, 1);
  }
`;

const fragment4 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  float easing(in float p) {
    return smoothstep(0.0, 1.0, p);
    // return clamp(p * p, 0.0, 1.0);
    // return clamp(p * (2.0 - p), 0.0, 1.0);
  }
  ${bezier.cubic_bezier}
  ${color.hsb}

  varying vec2 vUv;

  void main() {
    // float d = easing(vUv.x);
    // float d = vUv.x;
    float d = cubic_bezier(vUv.x, 0.5, -1.5, 0.5, 2.5);
    gl_FragColor.rgb = hsb2rgb(vec3(d, 1.0, 1.0));
    gl_FragColor.a = 1.0;
  }
`;

let renderer;
onMounted(() => {
  renderer = new GlRenderer(glRef.value);
  drawByTab(checkedTab.value);

  glRef.value.addEventListener('click', () => {
    drawByTab(checkedTab.value);
  });

  watch(checkedTab, () => {
    drawByTab(checkedTab.value);
  });
});

const drawByTab = value => {
  switch (value) {
    case 0:
      const program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);

      renderer.uniforms.color = [1, 0, 0, 1];
      renderer.uniforms.translation = [-0.5, 0];

      const animator = new Animator({duration: 2000});
      animator.animate(renderer, ({target, timing}) => {
        target.uniforms.translation = [-0.5 * (1 - timing.p) + 0.5 * timing.p, 0];
      });

      bufferData({
        positions: [
          [-0.25, -0.25],
          [-0.25, 0.25],
          [0.25, 0.25],
          [0.25, -0.25]
        ]
      });
      // 执行渲染
      renderer.render();
      break;
    case 1:
      const program1 = renderer.compileSync(fragment, vertex1);
      renderer.useProgram(program1);
      renderer.uniforms.uTime = 0.0;
      renderer.uniforms.uFromTo = [-0.5, 0, 0.5, 0];
      renderer.uniforms.color = [1, 0, 0, 1];
      let startTime = null;
      requestAnimationFrame(function update() {
        startTime = startTime || Date.now();
        renderer.uniforms.uTime = (Date.now() - startTime) / 1000;
        requestAnimationFrame(update);
      });
      bufferData({
        positions: [
          [-0.25, -0.25],
          [-0.25, 0.25],
          [0.25, 0.25],
          [0.25, -0.25]
        ]
      });
      // 执行渲染
      renderer.render();
      break;
    case 2:
      const program2 = renderer.compileSync(fragment2, vertex2);
      renderer.useProgram(program2);
      bufferData({
        positions: [
          [-0.5, -0.25],
          [-0.5, 0.25],
          [0.5, 0.25],
          [0.5, -0.25]
        ],
        attributes: {
          color: [
              [1, 0, 0, 1],
              [1, 0, 0, 1],
              [0, 0.5, 0, 1],
              [0, 0.5, 0, 1]
          ],
        }
      });
      renderer.render();
      break;
    case 3:
      const program3 = renderer.compileSync(fragment3, vertex3);
      renderer.useProgram(program3);
      bufferData({
        positions: [
          [-0.5, -0.25],
          [-0.5, 0.25],
          [0.5, 0.25],
          [0.5, -0.25]
        ]
      });
      renderer.uniforms.fromColor = [1, 0, 0, 1];
      renderer.uniforms.toColor = [0, 0.5, 0, 1];
      renderer.render();
      break;
    case 4:
      const program4 = renderer.compileSync(fragment4, vertex3);
      renderer.useProgram(program4);
      bufferData({
        positions: [
          [-0.5, -0.25],
          [-0.5, 0.25],
          [0.5, 0.25],
          [0.5, -0.25]
        ]
      });
      renderer.render();
      break;
  }
};

const bufferData = ({
     positions = [
       [-1, -1],
       [-1, 1],
       [1, 1],
       [1, -1]
     ],
     attributes = {}
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
      ],
      ...attributes,
    },
    cells: [
      [0, 1, 2],
      [2, 0, 3]
    ]
  }]);
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
