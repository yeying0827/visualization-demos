<template>
  <h3>课后练习</h3>
  <div>
    <span
        class="pattern-type"
        :class="{active: checkedTab === index}"
        @click="checkedTab = index"
        v-for="(item, index) in tabs">{{ item.name }}</span>
  </div>
  <canvas width="1024" height="1024" ref="patternPracticeRef"></canvas>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import GlRenderer from "gl-renderer";

const tabs = [
  {name: "彩色方块"},
  {name: "真·随机迷宫图案"},
  {name: "网格背景缩放移动（平移和缩放）"},
];
const checkedTab = ref(0);
const patternPracticeRef = ref(null);

const vertex = `
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;

  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    vUv = uv;
    gl_Position = vec4(a_vertexPosition, 1.0, 1.0);
  }
`;

// 彩色方块
const fragment1 = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;

  uniform int rows;

  // hsv -> rgb
  // 参数的取值范围都是 (0, 1)
  vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
  }

  // 伪随机数
  float random (in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898, 78.233)))
                  * 43758.5453123);
  }

  void main() {
    // vec2 st = vec2(random(floor(vUv * float(rows))));
    // gl_FragColor.rgb = vec3(st, 1.0);
    // gl_FragColor.a = 1.0;

    gl_FragColor.rgb = hsv2rgb(vec3(random(floor(vUv * float(rows))), 0.5, 1.0));
    gl_FragColor.a = 1.0;
  }
`;
// 真·随机迷宫
const fragment2 = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  #define PI 3.14159265358979323846

  varying vec2 vUv;
  uniform int rows;
  uniform float k;

  // 伪随机数
  float random (in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898, 78.233)))
                  * 43758.5453123);
  }

  vec2 truchetPattern(in vec2 _st, in float _index) {
    _index = fract((_index - 0.5) * 2.0);
    if (_index > 0.75) {
      _st = vec2(1.0) - _st; // 类似于取补码
    } else if (_index > 0.5) {
      _st = vec2(1.0 - _st.x, _st.y); // x取补码，y取原码
    } else if (_index > 0.25) {
      _st = 1.0 - vec2(1.0 - _st.x, _st.y);
    }
    return _st;
  }

  void main() {
    // 效果：迷宫
    vec2 st = vUv * float(rows);
    vec2 ipos = floor(st); // integer
    vec2 fpos = fract(st); // fraction

    vec2 tile = truchetPattern(fpos, random(ipos) * k);
    float color = 0.0;

    color = smoothstep(tile.x - 0.3, tile.x, tile.y) -
            smoothstep(tile.x, tile.x + 0.3, tile.y);

    gl_FragColor = vec4(vec3(color), 1.0);
  }
`;
// 移动&缩放网格
const fragment3 = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;
  uniform int rows;

  void main() {
    vec2 st = fract(vUv * float(rows));

    float d1 = step(st.x, 0.9);
    float d2 = step(0.1, st.y);

    gl_FragColor.rgb = mix(vec3(0.8), vec3(1.0), d1*d2);
    gl_FragColor.a = 1.0;
  }
`;
const vertex3 = `
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;

  varying vec2 vUv;

  uniform int scale;
  uniform vec2 offset;

  mat3 translateMatrix = mat3( // 平移矩阵
    1.0, 0.0, 0.0, // 第一列
    0.0, 1.0, 0.0, // 第二列
    offset.x, offset.y, 1.0 // 第三列
  );

  mat3 scaleMatrix = mat3( // 缩放矩阵
    float(scale), 0.0, 0.0,
    0.0, float(scale), 0.0,
    0.0, 0.0, 1.0
  );

  void main() {
    gl_PointSize = 1.0;
    vUv = uv;
    vec3 pos = scaleMatrix * translateMatrix * vec3(a_vertexPosition, 1.0);
    gl_Position = vec4(pos, 1.0);
  }
`;

let renderer, program;
const lastPos = {}, lastCenter = {};

onMounted(() => {
  // 创建Renderer对象
  renderer = new GlRenderer(patternPracticeRef.value);
  // 根据不同的片元着色器创建WebGL程序，并设置uniform变量
  customProgramAndDatas(checkedTab.value);
  // 写数据并渲染
  bufferDataAndRender();

  watch(checkedTab, () => {
    customProgramAndDatas(checkedTab.value);
    bufferDataAndRender();
  });
});

const customProgramAndDatas = type => {
  removeEvent();
  switch(type) {
    case 0:
      // 创建并启用WebGL程序
      program = renderer.compileSync(fragment1, vertex);
      renderer.useProgram(program);
      // 设置uniform变量
      renderer.uniforms.rows = 10;
      break;
    case 1:
      // 创建并启用WebGL程序
      program = renderer.compileSync(fragment2, vertex);
      renderer.useProgram(program);
      // 设置uniform变量
      renderer.uniforms.rows = 10;
      renderer.uniforms.k = Math.random() + 1; // 随机系数
      break;
    case 2:
      // 创建并启用WebGL程序
      program = renderer.compileSync(fragment3, vertex3);
      renderer.useProgram(program);
      renderer.uniforms.scale = 1;
      renderer.uniforms.offset = [0.0, 0.0];
      renderer.uniforms.rows = 64;
      lastCenter.x = 0.0;
      lastCenter.y = 0.0;
      addEvent();
      break;
  }
}

const bufferDataAndRender = () => {
  // 将顶点数据写入缓冲区
  // !!切换着色器之后要重新绑定缓冲区。
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

const wheelEventHandler = e => {
  e.preventDefault();
  if (e.wheelDeltaY > 0) { // 向下滚
    // console.log('向下滚'); // 放大
    if (renderer.uniforms.scale <= 50) {
      renderer.uniforms.scale += 1;
    }
  } else {
    // console.log('向上滚'); // 缩小
    if (renderer.uniforms.scale > 1) { // 使用浮点数会存在精度问题。scale=1.2以下绘制的网格边有问题，放大缩小过程中有时网格边粗细不一样
      renderer.uniforms.scale -= 1;
    }
  }
}
const mouseDownHandler = e => {
  e.preventDefault();
  // 记录初始位置
  lastPos.x = e.offsetX;
  lastPos.y = e.offsetY;
  // 绑定事件
  patternPracticeRef.value.addEventListener('mousemove', mouseMoveHandler);
}
const mouseMoveHandler = e => {
  e.preventDefault();
  // 计算坐标差值并转换为Canvas差值
  const { offsetX: x, offsetY: y } = e;
  const translateX = (x - lastPos.x) / patternPracticeRef.value.width;
  const translateY = (lastPos.y - y) / patternPracticeRef.value.height;
  // 设置偏移量
  renderer.uniforms.offset = [translateX + lastCenter.x, translateY + lastCenter.y];
}
const mouseUpHandler = e => {
  e.preventDefault();
  // 计算坐标差值并转换为Canvas差值
  const { offsetX: x, offsetY: y } = e;
  const translateX = (x - lastPos.x) / patternPracticeRef.value.width;
  const translateY = (lastPos.y - y) / patternPracticeRef.value.height;
  // 更新新的中心点
  lastCenter.x = translateX + lastCenter.x;
  lastCenter.y = translateY + lastCenter.y;
  // 解除事件绑定
  patternPracticeRef.value.removeEventListener('mousemove', mouseMoveHandler);
}

const addEvent = () => {
  patternPracticeRef.value.addEventListener('mousewheel', wheelEventHandler);
  patternPracticeRef.value.addEventListener('mousedown', mouseDownHandler);
  patternPracticeRef.value.addEventListener('mouseup', mouseUpHandler);
}

const removeEvent = () => {
  patternPracticeRef.value.removeEventListener('mousewheel', wheelEventHandler);
  patternPracticeRef.value.removeEventListener('mousedown', mouseDownHandler);
  patternPracticeRef.value.removeEventListener('mouseup', mouseUpHandler);
}
</script>

<style scoped>
.pattern-type {
  display: inline-block;
  padding: 4px 10px;
  background-color: #646cff;
  color: #fff;
  cursor: pointer;
}
.pattern-type.active {
  background-color: #4b52fc;
}
.pattern-type + .pattern-type {
  margin-left: 5px;
}
</style>
