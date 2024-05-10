<template>
  <h3>实际用途</h3>
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
import roadjpeg from '@/assets/road.jpeg';
import planetjpeg from '@/assets/planet.jpeg';

const tabs = [
  {name: "图像裁剪"},
  {name: "图像动态修饰（进度条）"},
];

const checkedTab = ref(0);
const glRef = ref(null);

const distanceFunction = `
  // 点到直线的距离
  float line_distance(in vec2 st, in vec2 a, in vec2 b) {
    vec3 ab = vec3(b - a, 0);
    vec3 p = vec3(st - a, 0);
    float l = length(ab);
    return cross(p, normalize(ab)).z;
  }

  // 点到线段的距离
  float seg_distance(in vec2 st, in vec2 a, in vec2 b) {
    vec3 ab = vec3(b - a, 0);
    vec3 p = vec3(st - a, 0);
    float l = length(ab);
    float d = abs(cross(p, normalize(ab)).z);
    float proj = dot(p, ab) / l;
    if(proj >= 0.0 && proj <= l) return d;
    return min(distance(st, a), distance(st, b));
  }

  // 点到三角形的距离
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
const fragment = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${distanceFunction}

  void main() {
    vec4 color = texture2D(tMap, vUv);
    // 以平移后的点，计算当前点的色值
    vec2 uv = vUv - vec2(0.5);
    vec2 a = vec2(-0.577, 0) - vec2(0.5);
    vec2 b = vec2(0.5, 1.866) - vec2(0.5);
    vec2 c = vec2(1.577, 0) - vec2(0.5);

    float scale = min(1.0, 0.0005 * uTime);
    // 纹理坐标平移后 与 三角形的距离
    float d = triangle_distance(uv, scale * a, scale * b, scale * c);
    // 当t1小于t2时: x小于t1返回0，当x大于t2返回1
    gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * color.rgb;
    gl_FragColor.a = 1.0;
  }
`;
const fragment1 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${distanceFunction}

  void main() {
    vec4 color = texture2D(tMap, vUv);
    // 以平移后的点，计算当前点的色值
    vec2 uv = vUv - vec2(0.5);
    vec2 a = vec2(0, 1); // 与Y轴同向
    float time = 0.0005 * uTime;

    // 正弦=对边/斜边
    // 余弦=邻边/斜边
    vec2 b = vec2(sin(time), cos(time)); // 从Y轴方向开始顺时针旋转
    float d = 0.0;

    float c0 = cross(vec3(b, 0.0), vec3(a, 0.0)).z; // b与a（Y轴方向）的叉积
    float c1 = cross(vec3(uv, 0.0), vec3(a, 0.0)).z; // uv与a（Y轴方向）的叉积
    float c2 = cross(vec3(uv, 0.0), vec3(b, 0.0)).z; // uv与b的叉积

    // c0 > 0.0：向量b在右半边圆
    // c1 > 0.0：向量uv在右半边
    // c2 < 0.0：uv在b的左侧
    if (c0 > 0.0 && c1 > 0.0 && c2 < 0.0) {
      d = 1.0;
    }

    // c0< 0.0：向量b在左半边圆
    // (c1 >= 0.0 || c2 <= 0.0)：向量uv在右半边 或 uv在b的左侧
    if (c0 < 0.0 && (c1 >= 0.0 || c2 <= 0.0)) {
      d = 1.0;
    }

    gl_FragColor.rgb = color.rgb;
    // mix(a,  b,  c)：线性插值函数。a和b是两个输入的颜色或值，c是一个介于0和1之间的浮点数，表示插值的权重
    // 当c接近0时，返回a；当c接近1时，mix函数返回b；当c在0和1之间时，返回a和b的插值结果。
    // d:0 -> 变绿    d:1 -> 原色
    gl_FragColor.r *= mix(0.3, 1.0, d);
    gl_FragColor.a = mix(0.9, 1.0, d);
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
      (async function() {
        const texture = await renderer.loadTexture(roadjpeg);
        renderer.uniforms.tMap = texture;
        update(0);
      }())
      break;
    case 1:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment1, vertex);
      renderer.useProgram(program);
      (async function() {
        const texture = await renderer.loadTexture(planetjpeg);
        renderer.uniforms.tMap = texture;
        update(0);
      }());
      break;
  }
}

const update = t => {
  renderer.uniforms.uTime = t;
  requestAnimationFrame(update);
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
