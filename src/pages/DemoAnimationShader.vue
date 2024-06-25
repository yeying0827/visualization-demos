<template>
  <h3>动画：Shader</h3>
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
import birdpng from '@/assets/bird.png';
import {Animator} from "../utils/animation.js";
import BesizerEasing from "bezier-easing";

const tabs = [
  {name: "固定帧动画"},
  {name: "非固定帧动画"},
  {name: "缓动函数"},
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
  uniform sampler2D tMap;
  uniform float fWidth;
  uniform vec2 vFrames[3]; // 3个二维向量，二维向量表示每一帧动画的图片起始x和结束x坐标
  uniform int frameIndex;

  void main() {
    vec2 uv = vUv;
    for (int i = 0; i < 3; i ++) {
      // 纹理坐标ux.x的取值范围
      uv.x = mix(vFrames[i].x, vFrames[i].y, vUv.x) / fWidth; // vUv 到 uv的映射
      if(float(i) == mod(float(frameIndex), 3.0)) break; // frameIndex除3的余数
    }

    vec4 color = texture2D(tMap, uv); // 按照uv坐标取色值

    gl_FragColor = color;
  }
`;

const vertex1 = `
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
const fragment1 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
  }
`;

const vertex2 = `
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`;
const fragment2 = `
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

const fragment3 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform vec4 color;

  void main() {
    gl_FragColor = color;
  }
`;
const vertex3 = `
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

let renderer;
onMounted(() => {
  renderer = new GlRenderer(glRef.value);
  drawByTab(checkedTab.value);

  watch(checkedTab, () => {
    drawByTab(checkedTab.value);
  });
});

const drawByTab = type => {
  switch (type) {
    case 0:
      const program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);
      (async function() {
        renderer.uniforms.tMap = await renderer.loadTexture(birdpng);
        renderer.uniforms.vFrames = [2, 88, 90, 176, 178, 264];
        renderer.uniforms.fWidth = 272;
        renderer.uniforms.frameIndex = 0;
        setInterval(() => {
          renderer.uniforms.frameIndex ++;
        }, 200);
        // 顶点坐标（WebGL画布绘制范围）
        const x = 43 / glRef.value.width; // 每帧的宽度
        const y = 30 / glRef.value.height; // 每帧的高度
        bufferData({
          positions: [
            [-x, -y],
            [-x, y],
            [x, y],
            [x, -y]
          ]
        });
        renderer.render();
      }());
      break;
    case 1:
      // const program1 = renderer.compileSync(fragment1, vertex1);
      const program1 = renderer.compileSync(fragment2, vertex2);
      renderer.useProgram(program1);
      renderer.uniforms.rotation = 0.0;
      renderer.uniforms.color = [1, 0, 0, 1];
      // requestAnimationFrame(function update() {
      //   renderer.uniforms.rotation += 0.05;
      //   requestAnimationFrame(update);
      // });
      const animator = new Animator({duration: 2000, iterations: Infinity, easing: BesizerEasing(0.76, 0, 0.24, 1)});
      animator.animate(renderer, ({target, timing}) => {
        target.uniforms.rotation = timing.p * 2 * Math.PI;
      });
      // 写数据并渲染
      bufferData({
        positions: [
          [-0.5, -0.5],
          [-0.5, 0.5],
          [0.5, 0.5],
          [0.5, -0.5]
        ]
      });
      renderer.render();
      break;
    case 2:
      const program4 = renderer.compileSync(fragment3, vertex3);
      renderer.useProgram(program4);

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
  }
}

const bufferData = ({
  positions = [
      [-1, -1],
      [-1, 1],
      [1, 1],
      [1, -1]
  ],
  attributes
}) => {
  renderer.setMeshData([{
    positions,
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
  }])
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
