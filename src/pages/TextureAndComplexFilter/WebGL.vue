<template>
  <h3>WebGL demo</h3>
  <div>
    <span
        class="filter-type"
        :class="{active: checkedTab === index}"
        @click="checkedTab = index"
        v-for="(item, index) in tabs">{{ item.name }}</span>
  </div>
  <canvas ref="canvasRef" width="1000" height="554"></canvas>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import GlRenderer from "gl-renderer";
import girl1jpg from '@/assets/girl1.jpg';
import catjpg from '@/assets/cat.jpeg';

const tabs = [
  {name: "灰度化"},
  {name: "粒子化"},
  {name: "图像合成"},
];

const checkedTab = ref(1);
const canvasRef = ref(null);

const vertex = `
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    vUv = uv;
    gl_Position = vec4(a_vertexPosition, 1, 1);
  }
`;
const fragment = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv; // 由顶点着色器传来的uv属性
  uniform sampler2D tMap;

  uniform mat4 colorMatrix;

  void main() {
    // gl_FragColor = texture2D(tMap, vUv); // 从纹理中提取颜色，vUv是纹理坐标

    vec4 color = texture2D(tMap, vUv);
    gl_FragColor = colorMatrix * vec4(color.rgb, 1.0);
    gl_FragColor.a = color.a;
  }
`;
const fragment1 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform sampler2D tMap;
  uniform float uTime;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(
              sin(
                dot(st.xy, vec2(12.9898, 78.233))
              ) *
              43758.5453123
           );
  }

  void main() {
    vec2 st = vUv * vec2(100, 55.4); // 5540个 10x10的方格。st：当前像素映射到纹理坐标中的坐标值
    vec2 uv = vUv + 1.0 - 2.0 * random(floor(st));
    // mix(a,  b,  c)：线性插值函数。a和b是两个输入的颜色或值，c是一个介于0和1之间的浮点数，表示插值的权重
    // 当c接近0时，返回a；当c接近1时，mix函数返回b；当c在0和1之间时，返回a和b的插值结果。
    vec4 color = texture2D(tMap, mix(uv, vUv, min(uTime, 1.0)));
    gl_FragColor.rgb = color.rgb;
    gl_FragColor.a = color.a * uTime;
  }
`;
const fragment2 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform sampler2D tCat;

  void main() {
    vec4 color = texture2D(tMap, vUv);
    vec2 st = vUv * 3.0 - vec2(1.2, 0.5); // 纹理坐标缩放和平移
    vec4 cat = texture2D(tCat, st); // 取到纹理坐标上另一个位置上的色值。e.g.原来取(0.5,0.5)的纹理色值，变为取(0.3,1)的纹理色值

    gl_FragColor.rgb = cat.rgb;
    if(cat.r < 0.5 && cat.g > 0.6) {
      gl_FragColor.rgb = color.rgb;
    }
    gl_FragColor.a = color.a;
  }
`;

let renderer, program;
onMounted(() => {
  // 创建Renderer对象
  renderer = new GlRenderer(canvasRef.value);
  drawByTab(checkedTab.value);
  // 写数据并渲染
  bufferDataAndRender();

  watch(checkedTab, () => {
    drawByTab(checkedTab.value);
    // 写数据并渲染
    bufferDataAndRender();
  });

  // ===================================================== //
  // const gl = canvasRef.value.getContext('webgl');
  // const webgl = new WebGL(gl, vertex, fragment);
  // // 顶点数据
  // webgl.bufferPosition([
  //     [-1, -1],
  //     [-1, 1],
  //     [1, 1],
  //     [1, -1]
  // ]);
  // webgl.readPosition("a_vertexPosition");
  // // 纹理坐标
  // webgl.bufferPosition([
  //   [0, 0],
  //   [0, 1],
  //   [1, 1],
  //   [1, 0]
  // ]);
  // webgl.readPosition("uv");
  // const bitmap = await loadImage(girl1jpg).then(girl1 => createImageBitmap(girl1, {imageOrientation: 'flipY'}));
  // const texture = webgl.createTexture(bitmap);
  // webgl.setTexture(texture, "tMap");
  // webgl.drawCells(new Uint16Array([0, 1, 2, 2, 0, 3]));
});
const drawByTab = async tab => {
  let texture;
  switch (tab) {
    case 0:
      // 创建并启用WebGL程序
      program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);
      // 设置uniform变量
      texture = await renderer.loadTexture(girl1jpg);
      renderer.uniforms.tMap = texture;
      // 灰度化配置
      const r = 0.2126,
          g = 0.7152,
          b = 0.0722;
      renderer.uniforms.colorMatrix = [
        r, r, r, 0,
        g, g, g, 0,
        b, b, b, 0,
        0, 0, 0, 1
      ];
      break;
    case 1:
      // 创建并启用WebGL程序
      program = renderer.compileSync(fragment1, vertex);
      renderer.useProgram(program);
      // 设置uniform变量
      texture = await renderer.loadTexture(girl1jpg);
      renderer.uniforms.tMap = texture;
      // 粒子化配置
      renderer.uniforms.uTime = 0.0;
      // !!需要刷新页面看效果
      // 动态设置
      requestAnimationFrame(function update(t) {
        renderer.uniforms.uTime = t / 2000;
        if (t < 2000) {
          requestAnimationFrame(update);
        }
      });
      break;
    case 2:
      // 创建并启用WebGL程序
      program = renderer.compileSync(fragment2, vertex);
      renderer.useProgram(program);
      // 设置uniform变量
      texture = await renderer.loadTexture(girl1jpg);
      renderer.uniforms.tMap = texture;
      const catTexture = await renderer.loadTexture(catjpg);
      renderer.uniforms.tCat = catTexture;
      break;
  }
};

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
