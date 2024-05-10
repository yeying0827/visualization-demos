<template>
  <h3>绘制线</h3>
  <p>点到直线（向量）的距离</p>
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
  {name: "斜线"},
  {name: "鼠标控制直线"},
  {name: "点到线段的距离"},
];

const checkedTab = ref(0);
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
    // 两个向量叉积的绝对值
    // 点到直线（向量）的距离
    float d = abs(
      cross(vec3(vUv, 0), normalize(line)).z
    );

    // ??? https://zhuanlan.zhihu.com/p/170493708
    // 当t1小于t2时: x小于t1返回0，当x大于t2返回1
    // gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);

    // 当t1大于t2时: x大于t1返回0，当x小于t2返回1
    gl_FragColor.rgb = smoothstep(0.01, 0.0, d) * vec3(1.0);


    gl_FragColor.a = 1.0;
  }
`;
const fragment1 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform vec2 uMouse;
  uniform vec2 uOrigin;

  void main() {
    // vec3 line = vec3(uMouse, 0); // 用向量表示所在直线
    // float d = abs(
    //   cross(vec3(vUv, 0), normalize(line)).z
    // ); // 叉积表示平行四边形面积

    // 原点变化
    vec3 line = vec3(uMouse - uOrigin, 0);
    float d = abs(
      cross(vec3(vUv - uOrigin, 0), normalize(line)).z
    );

    gl_FragColor.rgb = smoothstep(0.01, 0.0, d) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
const fragment2 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform vec2 uMouse;
  uniform vec2 uOrigin;

  // 点到线段的距离
  float seg_distance(in vec2 st, in vec2 a, in vec2 b) {
    vec3 ab = vec3(b - a, 0); // 目标线段所在向量
    vec3 p = vec3(st - a, 0); // 待检测向量
    float l = length(ab); // 向量长度
    float d = abs(
      cross(p, normalize(ab)).z
    ); // p到目标向量的距离
    float proj = dot(p, ab) / l; // p在目标向量上的投影
    if(proj >= 0.0 && proj <= l) return d; // 投影在目标线段两个端点之间
    // 在Shader中，distance函数用于计算两个点之间的欧几里得距离
    return min(distance(st, a), distance(st, b)); // p在线段左边或右边时（距离两个端点的距离）
  }

  void main() {
    float d = seg_distance(vUv, uOrigin, uMouse);
    gl_FragColor.rgb = smoothstep(0.01, 0.0, d) * vec3(1.0);
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
      renderer.uniforms.uMouse = [-1, -1]; // 鼠标移动点
      renderer.uniforms.uOrigin = [0, 0]; // 设置原点
      addEvent();
      break;
    case 2:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment2, vertex);
      renderer.useProgram(program);
      renderer.uniforms.uMouse = [-1, -1]; // 鼠标移动点
      renderer.uniforms.uOrigin = [0, 0]; // 设置原点
      addEvent();
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

const addEvent = () => {
  glRef.value.addEventListener('mousemove', e => {
    const {width, height} = e.target.getBoundingClientRect();
    const {offsetX: x, offsetY: y} = e;
    renderer.uniforms.uMouse = [
      x / width,
      (height - y) / height
    ];
  });
  glRef.value.addEventListener('click', e => {
    const {width, height} = e.target.getBoundingClientRect();
    const {offsetX: x, offsetY: y} = e;
    renderer.uniforms.uOrigin = [
      x / width,
      (height - y) / height
    ];
  });
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
