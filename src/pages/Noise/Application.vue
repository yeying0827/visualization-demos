<template>
  <h3>应用</h3>
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
  {name: "类似水滴滚过物体表面"},
  {name: "类似木头的条纹"},
];
const checkedTab = ref(1);

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
const fragment = ` // 类似水滴滚过物体表面
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float uTime;

  float random(vec2 st) {
    return fract(
      sin(
        dot(st.xy, vec2(12.9898, 78.233))
      )
      *
      43758.5453123
    );
  }

  highp float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(random(i + vec2(0.0, 0.0)), random(i + vec2(1.0, 0.0)), u.x),
      mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    // vec2 st = (vUv - vec2(0.5)) * 20.0;
    vec2 st = mix(vec2(-10, -10), vec2(10, 10), vUv);
    float d = distance(st, vec2(0)); // 与点(0,0)的距离
    d *= noise(uTime + st); // 乘以噪声（0~1），得到新的距离值
    d = smoothstep(0.0, 1.0, d) - step(1.0, d); // d大于1的为0，黑色
    gl_FragColor.rgb = vec3(d);
    gl_FragColor.a = 1.0;
  }
`;
const fragment1 = `// 类似木头的条纹
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float uTime;

  float random(vec2 st) {
    return fract(
      sin(
        dot(st.xy, vec2(12.9898, 78.233))
      )
      *
      43758.5453123
    );
  }

  highp float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(random(i + vec2(0.0, 0.0)), random(i + vec2(1.0, 0.0)), u.x),
      mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float lines(in vec2 pos, float b) {
    float scale = 10.0;
    pos *= scale;
    return smoothstep(
      0.0,
      0.5 + b * 0.5,
      abs(sin(pos.x * 3.1415) + b * 2.0) * 0.5
    );
  }

  vec2 rotate(vec2 v0, float ang) {
    float sinA = sin(ang);
    float cosA = cos(ang);
    mat3 m = mat3(
      cosA,  -sinA, 0,
      sinA,  cosA,  0,
      0,     0,     1
    );
    return (m * vec3(v0, 1.0)).xy;
  }

  void main() {
    vec2 st = vUv.yx * vec2(10.0, 3.0); // xy互换并缩放
    st = rotate(st, noise(st)); // 旋转一个角度

    float d = lines(st, 0.5); // 0-1 平滑过渡

    gl_FragColor.rgb = 1.0 - vec3(d);
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
  })
});

const drawByTab = tab => {
  switch (tab) {
    case 0:
      program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);
      renderer.uniforms.uTime = 0.0;
      requestAnimationFrame(function update(t) {
        renderer.uniforms.uTime = t / 1000;
        requestAnimationFrame(update);
      });
      break;
    case 1:
      program = renderer.compileSync(fragment1, vertex);
      renderer.useProgram(program);
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
    cells: [
      [0, 1, 2],
      [2, 0, 3]
    ]
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
