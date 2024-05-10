<template>
  <h3>绘制圆形</h3>
  <p>根据点坐标到圆心的距离来生成颜色</p>
  <div>
    <span
        class="filter-type"
        :class="{active: checkedTab === index}"
        @click="checkedTab = index"
        v-for="(item, index) in tabs">{{ item.name }}</span>
  </div>
  <canvas ref="glRef" width="512" height="512" v-show="checkedTab !== 3"></canvas>
  <canvas ref="girlRef" width="1000" height="554" v-show="checkedTab === 3"></canvas>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import GlRenderer from "gl-renderer";
import girl1jpg from '@/assets/girl1.jpg';

const tabs = [
  {name: "模糊的圆"},
  {name: "清晰的圆1（step）"},
  {name: "清晰的圆2（smoothstep）"},
  {name: "渐显渐隐效果"},
];

const checkedTab = ref(2);
const glRef = ref(null);
const girlRef = ref(null);

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
    // distance函数：vUv和纹理坐标中心vec2(0.5)的距离
    float d = distance(vUv, vec2(0.5));
    // d越小，色值越接近黑色
    gl_FragColor.rgb = d * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
const fragment1 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  void main() {
    float d = distance(vUv, vec2(0.5));
     // 距离大于0.2时，step结果为0（黑色）；否则为1（白色）
    gl_FragColor.rgb = step(d, 0.2) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
const fragment2 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  void main() {
    float d = distance(vUv, vec2(0.5));

    // float smoothstep(float edge0, float edge1, float x);
    // 参数说明：
    // - edge0：定义平滑区域的开始边缘。
    // - edge1：定义平滑区域的结束边缘。
    // - x：要测试的值。
    // 当\`x\`在\`edge0\`和\`edge1\`之间时，函数返回一个在0和1之间的平滑插值。
    // 如果\`x\`小于\`edge0\`，返回值是0；如果\`x\`大于\`edge1\`，返回值是1。
    // 这个函数通常用于在两个值之间创建一个平滑的过渡，例如在渲染中的纹理混合、颜色渐变或者边缘检测中。

    // ??? https://zhuanlan.zhihu.com/p/170493708
    // 当t1小于t2时: x小于t1返回0，当x大于t2返回1
    // 当t1大于t2时: x大于t1返回0，当x小于t2返回1 ✅
    // d大于0.205 ==> 0 黑色 ； d小于0.2 ==> 1 白色
    gl_FragColor.rgb = smoothstep(0.2 + 0.005, 0.2, d) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
const fragment3 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  uniform sampler2D tMap;
  uniform vec2 uResolution;
  uniform float uTime;

  float random(vec2 st) {
    return fract(
      sin(
        dot(st.xy, vec2(12.9898, 78.233))
      ) *
      43758.5453123
    );
  }

  void main() {
    vec2 uv = vUv;
    uv.y *= uResolution.y / uResolution.x; // y坐标乘以一个系数
    vec2 st = uv * 100.0; // 横纵坐标值放大100倍
    float d = distance(fract(st), vec2(0.5)); // 与对应网格中心点的距离
    float p = uTime + random(floor(st)); // 随机值
    float shading = 0.5 + 0.5 * sin(p); // 随机值为0的情况下：'0.5 - 1 - 0.5 - 0 - 0.5' 循环
    d = smoothstep(d, d + 0.01, shading); // 0~1
    vec4 color = texture2D(tMap, vUv); // 按纹理坐标取色值

    // T clamp(T x, float a,float b)    min(max(x, a), b)
    // float b = -0.2;
    // gl_FragColor.rgb = color.rgb * clamp(0.5, 1.3, b);

    // 在1.3 和 d + 1.0 * shading 之间变化
    // gl_FragColor.rgb = color.rgb * clamp(0.5, 1.3, d + 1.0 * shading);
    gl_FragColor.rgb = color.rgb * min(1.3, d + shading);
    gl_FragColor.a = color.a;
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
      renderer = new GlRenderer(girlRef.value);
      (async function() {
        program = renderer.compileSync(fragment3, vertex);
        renderer.useProgram(program);
        const texture = await renderer.loadTexture(girl1jpg);
        renderer.uniforms.tMap = texture;
        renderer.uniforms.uTime = 0.0;
        requestAnimationFrame(function update(t) {
          renderer.uniforms.uTime = t / 2000;
          requestAnimationFrame(update);
        });
        renderer.uniforms.uResolution = [1000, 554];
      }());
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
