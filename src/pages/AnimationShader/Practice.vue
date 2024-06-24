<template>
  <h3>课后练习</h3>
  <div>
    <span
        class="filter-type"
        :class="{active: checkedTab === index}"
        @click="checkedTab = index"
        v-for="(item, index) in tabs">{{ item.name }}</span>
  </div>
  <canvas width="512" height="512" ref="glRef" v-show="checkedTab !== 3"></canvas>
  <canvas width="1152" height="648" ref="bloomRef" v-show="checkedTab === 3"></canvas>
</template>

<script setup>
import {ref, onMounted, watch} from "vue";
import GlRenderer from "gl-renderer";
import {Animator} from "../../utils/animation.js";
import BezierEasing from "bezier-easing";
import {createParticles} from '../../utils/particles.js';
import junmingjpg from '@/assets/kiminonamaiwa.jpg';

const tabs = [
  {name: "缩放"},
  {name: "扭曲"},
  {name: "组合"},
  {name: "粒子爆炸?"},
];

const checkedTab = ref(3);

const vertex = `
  attribute vec2 a_vertexPosition;
  uniform vec2 scale;

  void main() {
    float scaleX = scale.x;
    float scaleY = scale.y;
    mat3 transformMatrix = mat3(
      scaleX, 0, 0,
      0, scaleY, 0,
      0, 0, 1
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
  uniform vec2 rad;

  void main() {
    float x_rad = rad.x;
    float y_rad = rad.y;
    mat3 transformMatrix = mat3(
      1.0, tan(y_rad), 0,
      tan(x_rad), 1.0, 0,
      0, 0, 1
    );
    vec3 pos = transformMatrix * vec3(a_vertexPosition, 1);
    gl_Position = vec4(pos, 1);
  }
`;

const vertex2 = `
  attribute vec2 a_vertexPosition;
  uniform float rotation;
  uniform vec2 scale;
  uniform vec2 translation;
  uniform vec2 rad;

  void main() {
    float x_scale = scale.x;
    float y_scale = scale.y;
    mat3 scaleMatrix = mat3( // 缩放矩阵
      x_scale, 0, 0,
      0, y_scale, 0,
      0, 0, 1
    );
    float c = cos(rotation);
    float s = sin(rotation);
    mat3 rotationMatrix = mat3( // 旋转矩阵
      c, s, 0,
      -s, c, 0,
      0, 0, 1
    );
    mat3 translationMatrix = mat3( // 平移矩阵
      1, 0, 0,
      0, 1, 0,
      translation, 1
    );

    float x_rad = rad.x;
    float y_rad = rad.y;
    mat3 skewMatrix = mat3( // 扭曲矩阵
      1.0, tan(y_rad), 0,
      tan(x_rad), 1.0, 0,
      0, 0, 1
    );
    vec3 pos = skewMatrix * scaleMatrix * rotationMatrix * translationMatrix * vec3(a_vertexPosition, 1);
    gl_Position = vec4(pos, 1);
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
const fragment3 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform float uTime;
  uniform sampler2D tMap;
  varying vec2 vUv;

  void main() {
    vec2 st = vUv * vec2(100.0); //vec2(576.0, 324.0);
    vec2 i_st = floor(st);

    // float d = (distance(vUv, vec2(0.5)));
    float d = (distance(i_st, 0.5 * vec2(100.0)));

    vec4 color = texture2D(tMap, vUv);

    float a = mix(0.0, 1.0, d / uTime * 100.0);


    gl_FragColor.rgb = color.rgb;
    gl_FragColor.a = a;
  }
`;

const glRef = ref(null);
const bloomRef = ref(null);
let renderer, bloomRenderer;
let bloomFrame = null;

onMounted(() => {
  renderer = new GlRenderer(glRef.value);
  bloomRenderer = new GlRenderer(bloomRef.value);
  drawByTab(checkedTab.value);

  watch(checkedTab, () => {
    drawByTab(checkedTab.value);
  });

  glRef.value.addEventListener('click', () => drawByTab(checkedTab.value));
  bloomRef.value.addEventListener('click', () => drawByTab(checkedTab.value));
});

const drawByTab = tab => {
  switch (tab) {
    case 0:
      const program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);
      renderer.uniforms.scale = [0.0, 0.0];
      renderer.uniforms.color = [1, 0, 0, 1];
      // const animator = new Animator({duration: 2000, easing: p => p * (2 - p)});
      const animator = new Animator({duration: 2000, easing: BezierEasing(0.5, -1.5, 0.5, 2.5)});
      animator.animate(renderer, ({target, timing: {p}}) => {
        renderer.uniforms.scale = [p, p];
      });
      handleBufferData({
        positions: [
            [-0.5, -0.5],
            [-0.5, 0.5],
            [0.5, 0.5],
            [0.5, -0.5]
        ]
      });
      renderer.render();
      break;
    case 1:
      const program1 = renderer.compileSync(fragment, vertex1);
      renderer.useProgram(program1);
      renderer.uniforms.rad = [0.0, 0.0];
      renderer.uniforms.color = [1, 0, 0, 1];
      // const animator1 = new Animator({duration: 2000, easing: p => p });
      const animator1 = new Animator({duration: 2000, easing: BezierEasing(0.5, -1.5, 0.5, 2.5)});
      animator1.animate(renderer, ({target, timing: {p}}) => {
        renderer.uniforms.rad = [p, p];
      });
      handleBufferData({
        positions: [
          [-0.25, -0.25],
          [-0.25, 0.25],
          [0.25, 0.25],
          [0.25, -0.25]
        ]
      });
      renderer.render();
      break;
    case 2:
      const program2 = renderer.compileSync(fragment, vertex2);
      renderer.useProgram(program2);
      renderer.uniforms.rotation = 0.0;
      renderer.uniforms.scale = [0.0, 0.0];
      renderer.uniforms.color = [1, 0, 0, 1];
      renderer.uniforms.translation = [-0.5, 0];
      renderer.uniforms.rad = [0.0, 0.0];
      // const animator2 = new Animator({duration: 2000, easing: p => p });
      const animator2 = new Animator({duration: 2000, easing: BezierEasing(0.5, -1.5, 0.5, 2.5)});
      animator2.animate(renderer, ({target, timing: {p}}) => {
        target.uniforms.scale = [p, p];
        target.uniforms.rotation = p * 2 * Math.PI;
        target.uniforms.translation = [-0.5 * (1 - p) + 0.5 * p, 0];
        renderer.uniforms.rad = [p, p];
      });
      handleBufferData({
        positions: [
          [-0.25, -0.25],
          [-0.25, 0.25],
          [0.25, 0.25],
          [0.25, -0.25]
        ]
      });
      renderer.render();
      break;
    case 3:
      const program3 = bloomRenderer.compileSync(fragment3, vertex3);
      bloomRenderer.useProgram(program3);
      (async function() {
        const texture = await bloomRenderer.loadTexture(junmingjpg);
        bloomRenderer.uniforms.tMap = texture;
        // bloomRenderer.uniforms.uTime = 0.0;

        // const animator3 = new Animator({duration: 2000, easing: BezierEasing(0.5, -1.5, 0.5, 2.5)});
        // await animator3.animate(bloomRenderer, ({target, timing: {p}}) => {
        //   target.uniforms.scale = [p, p];
        // });
        cancelAnimationFrame(bloomFrame);
        const update = t => {
          bloomRenderer.uniforms.uTime = t * 4;
          bloomFrame = requestAnimationFrame(update);
        }
        update(0);


        bloomRenderer.setMeshData([{
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
            ],
          },
          cells: [
            [0, 1, 2],
            [2, 0, 3]
          ]
        }]);

        bloomRenderer.render();
      }());
  }
};

const handleBufferData = ({
  positions = [
      [-1, -1],
      [-1, 1],
      [1, 1],
      [1, -1]
  ],
  attributes = {}
}) => {
  renderer.setMeshData([{
    positions: positions,
    attributes: {
      uv: [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0]
      ],
      ...attributes
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
