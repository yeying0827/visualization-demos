<template>
  <div class="grid-bg"></div>
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

    varying vec2 vUv;
    uniform float rows;

    void main() {
      // 针对某个像素点执行
      // vUv: 一个单元的坐标，坐标的范围：正方形
      // vUv * rows：待处理的像素点  映射 纹理坐标上的位置，映射的坐标 => 计算色值

      vec2 st = fract(vUv * rows); // 像素点对应纹理坐标的小数部分
      float d1 = step(st.x, 0.9);
      float d2 = step(0.1, st.y);
      // st.x <=0.9 && st.y >=0.1 ===> d1*d2=1

      // d1=0 || d2=0     <======>    st.x>0.9 || st.y < 0.1
      gl_FragColor.rgb = mix(vec3(0.8), vec3(1.0), d1 * d2);
      gl_FragColor.a = 1.0;
    }
  `;

  // 创建Renderer对象
  const canvas = document.querySelector('canvas');
  const renderer = new GlRenderer(canvas);
  // 创建WebGL程序
  const program = renderer.compileSync(fragment, vertex);
  renderer.useProgram(program);
  // 设置uniform
  renderer.uniforms.rows = 64;
  // 把数据送入缓冲区
  renderer.setMeshData([{
    positions: [
        [-1, -1],
        [-1, 1],
        [1, 1],
        [1, -1]
    ],
    attributes: {
      uv: [ // 纹理坐标
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0]
      ]
    },
    cells: [ // 三角剖分
        [0, 1, 2],
        [2, 0, 3]
    ]
  }]);
  // 渲染
  renderer.render();
});
</script>

<style scoped>
.grid-bg {
  width: 256px;
  height: 256px;
  background-image: linear-gradient(to right, transparent 95%, #ccc 0), linear-gradient(to bottom, transparent 95%, #ccc 0);
  background-size: 8px 8px, 8px 8px;
  //background-repeat: repeat;
}
</style>
