<template>
  <h3>WebGL demo（重复图案）</h3>
  <canvas width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted} from "vue";
import GlRenderer from 'gl-renderer';

onMounted(() => {
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
    precision mediump float;
    #endif

    varying vec2 vUv; // 由顶点着色器传来的uv属性
    uniform float rows;

    // 最终得到当前像素点所要渲染的色值
    void main() {
      // vUv * rows：纹理坐标相当于一个单元的坐标，坐标的范围是一个正方形
      // 所以*rows相当于把纹理坐标在画布上的横向和纵向分别放大rows倍，然后可以得到当前所要处理的像素在其中对应的坐标（映射）
      // 后续利用这个对应的坐标去计算色值

      // st：保存像素点对应纹理坐标的小数部分
      vec2 st = fract(vUv * rows); // fract函数是一个用于获取向量中小数部分的函数
      float d1 = step(st.x, 0.9); // step：阶梯函数。当step(a,b)中的b < a时，返回0；当b >= a时，返回1。
      // step函数相当于判断b是否大于等于a，若是，就返回1（真值）；否则返回0（假值）。
      float d2 = step(0.1, st.y);
      // mix(a,  b,  c)：线性插值函数。a和b是两个输入的颜色或值，c是一个介于0和1之间的浮点数，表示插值的权重
      // 当c接近0时，返回a；当c接近1时，mix函数返回b；当c在0和1之间时，返回a和b的插值结果。

      // 根据d1*d2的值，决定使用哪个颜色来绘制当前像素。
      // st.x <= 0.9 且 st.y >= 0.1时，d1*d2=1, 否则为0
      // 1. st.x <= 0.9 且 st.y >= 0.1  -->  d1*d2=1 --> rgb = vec3(1.0)白
      // 2. 其他情况  --> d1*d2=0 --> rgb = vec(0.8)灰
      gl_FragColor.rgb = mix(vec3(0.8), vec3(1.0), d1 * d2);
      gl_FragColor.a = 1.0;

      // rows决定网格的数量，所以最终的效果和rows的取值有关。
    }
  `;

  // 第一步：创建Renderer对象
  const canvas = document.querySelector('canvas');
  const renderer = new GlRenderer(canvas);
  // 第二步：创建并启用WebGL程序
  const program = renderer.compileSync(fragment, vertex);
  renderer.useProgram(program);
  // 第三步：设置uniform变量
  renderer.uniforms.rows = 32; // 64; // 每一行显示多少个网格（在片元着色器中使用）
  // 第四步：将顶点数据送入缓冲区
  renderer.setMeshData([{
    positions: [ // 顶点（覆盖整个画布）
        [-1, -1], // 左下
        [-1, 1], // 左上
        [1, 1], // 右上
        [1, -1] // 右下
    ],
    attributes: {
      uv: [ // 纹理坐标（坐标系：左下角[0,0] 右上角[1,1]）
          [0, 0], // 左下
          [0, 1], // 左上
          [1, 1], // 右上
          [1, 0] // 右下
      ]
    },
    cells: [ // 顶点索引（三角剖分）：将矩形剖分成两个三角形。WebGL只能渲染经过三角剖分之后的多边形。
        [0, 1, 2],
        [2, 0, 3]
    ]
  }]);
  // 第五步：执行渲染
  renderer.render();
});
</script>
