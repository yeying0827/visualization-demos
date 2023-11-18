<template>
  <h3>WebGL填充多边形</h3>
  <canvas height="512" width="512"></canvas>
</template>

<script setup>
import {onMounted} from "vue";
import WebGL from "../../utils/WebGL.js";
import {earcutTriangulation} from "../../utils/polygon.js";

onMounted(() => {
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl');

  const vertices = [ // 多边形顶点
    [-0.7, 0.5],
    [-0.4, 0.3],
    [-0.25, 0.71],
    [-0.1, 0.56],
    [-0.1, 0.13],
    [0.4, 0.21],
    [0, -0.6],
    [-0.3, -0.3],
    [-0.6, -0.3],
    [-0.45, 0.0],
  ];
  const points = vertices.flat();
  const triangles = earcutTriangulation(points);
  // console.log(triangles);

  // 创建WebGL程序
  // 1. 编程着色器
  const vertex = `
    attribute vec2 position;

    void main() {
      gl_Position = vec4(position, 1.0, 1.0);
    }
  `;
  const fragment = `
    precision mediump float;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `;
  const webgl = new WebGL(gl, vertex, fragment);
  webgl.drawPolygon(points, triangles, undefined, gl.LINE_STRIP);
});
</script>

<style scoped>
canvas {
  width: 512px;
  height: 512px;
}
</style>
