<template>
  <h3>例子：粒子动画</h3>
  <canvas width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted} from "vue";
import WebGL from "../../utils/WebGL.js";

let webgl;
const position = new Float32Array([
    -1, -1,
    0, 1,
    1, -1
]); // 随机三角形原始坐标
let triangles = []; // 随机三角形数组
onMounted(() => {
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl');
  // 顶点着色器的GLSL代码
  const vertex = `
    attribute vec2 position;

    uniform float u_rotation;
    uniform float u_scale;
    uniform float u_time;
    uniform float u_duration;
    uniform vec2 u_dir;

    varying float vP;

    void main() {
      float p = min(1.0, u_time / u_duration); // 当前动画进度，取值区间[0,1]。防止精度误差导致的进度越界
      float rad = u_duration + 3.14 * 10.0 * p; // 旋转角度：初始角度加上10π，表示在动画过程中会绕自身旋转5周
      float scale = u_scale * p * (2.0 - p); // 缩放比例：初始缩放比例乘以一个系数。p * (2.0 - p)是一个缓动函数，作用是：让scale的变化量随着时间推移逐渐减小
      float x_rad = 3.14 * p * (2.0 - p);
      float y_rad = 3.14 * p * p;

      vec2 offset = 2.0 * u_dir * p * p; // u_dir是单位向量，2.0表示它的最大移动距离为2。p * p也是一个缓动函数，作用：让位移的变化量随着时间增加而增大

      // 三个齐次矩阵
      // 矩阵的元素按照自上而下再自左向右传入作为参数
      // glsl中默认矩阵以列主序：先列后行
      mat3 translateMatrix = mat3( // 平移矩阵
        1.0, 0.0, 0.0, // 第一列
        0.0, 1.0, 0.0, // 第二列
        offset.x, offset.y, 1.0 // 第三列
      );
      mat3 rotateMatrix = mat3( // 旋转矩阵
        cos(rad), sin(rad), 0.0,
        -sin(rad), cos(rad), 0.0,
        0.0, 0.0, 1.0
      );
      mat3 scaleMatrix = mat3( // 缩放矩阵
        scale, 0.0, 0.0,
        0.0, scale, 0.0,
        0.0, 0.0, 1.0
      );
      mat3 skewMatrix = mat3( // 扭曲矩阵：倾斜
        1.0, tan(y_rad), 0.0,
        tan(x_rad), 1.0, 0.0,
        0.0, 0.0, 1.0
      );

      gl_PointSize = 1.0;
      // 完成对顶点的线性变换
      // 三角形会向着特定的方向旋转、移动和缩放
      vec3 pos = skewMatrix * translateMatrix * rotateMatrix * scaleMatrix * vec3(position, 1.0);
      gl_Position = vec4(pos, 1.0);

      vP = p;
    }
  `;
  const fragment = `
    precision mediump float;

    uniform vec4 u_color;

    varying float vP;

    void main() {
      gl_FragColor.rgb = u_color.rgb;
      gl_FragColor.a = (1.0 - vP) * u_color.a; // 让alpha值随着vP值变化；实现粒子的淡出效果
    }
  `;

  webgl = new WebGL(gl, vertex, fragment);
  webgl.createWebGLProgram();
  webgl.bufferPosition(position);
  webgl.readPosition();

  requestAnimationFrame(update);
});

/*
* 动态更新triangle数组，并绘制三角形
* */
function update() {
  const {gl} = webgl;

  for (let i = 0; i < 5 * Math.random(); i ++) {
    triangles.push(randomTriangles());
  }
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 对每个三角形重新设置u_time
  triangles.forEach(triangle => {
    triangle.u_time = (performance.now() - triangle.startTime) / 1000; // 已播放时间
    setUniforms(triangle);
    gl.drawArrays(gl.TRIANGLES, 0, position.length / 2);
  });
  // 移除已经结束动画的三角形
  triangles = triangles.filter(triangle => {
    return triangle.u_time <= triangle.u_duration;
  });
  requestAnimationFrame(update);
}

/*
* 将随机三角形的信息传给shader中的uniform变量
* */
function setUniforms({u_color, u_rotation, u_scale, u_time, u_duration, u_dir}) {
  const uniforms = [
      ['u_color', u_color, '4fv'],
      ['u_rotation', u_rotation, '1f'],
      ['u_scale', u_scale, '1f'],
      ['u_time', u_time, '1f'],
      ['u_duration', u_duration, '1f'],
      ['u_dir', u_dir, '2fv']
  ];
  webgl.setUniforms(uniforms);
}

/*
* 生成随机三角形的属性
* */
function randomTriangles() {
  const u_color = [Math.random(), Math.random(), Math.random(), 1.0]; // 随机颜色
  const u_rotation = Math.random() * Math.PI; // 随机的初始旋转角度
  const u_scale = Math.random() * 0.05 + 0.03; // 随机的初始大小
  const u_time = 0; // 已播放时间
  const u_duration = 3.0; // 动画持续时间：3s

  const rad = Math.random() * Math.PI * 2; //
  const u_dir = [Math.cos(rad), Math.sin(rad)]; // 运动方向
  const startTime = performance.now(); // 创建时间

  return {
    u_color,
    u_rotation,
    u_scale,
    u_time,
    u_duration,
    u_dir,
    startTime
  }
}
</script>

<style scoped>
canvas {
  width: 512px;
  height: 512px;
  background: #eee;
}
</style>
