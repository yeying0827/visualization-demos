<template>
  <h3>使用Tess2</h3>
  <canvas height="512" width="512" id="ellipse"></canvas>
  <canvas height="512" width="512" id="five"></canvas>
</template>

<script setup>
import {onMounted} from "vue";
import {WINDING_NONZERO} from "tess2";
import WebGL from "../../utils/WebGL.js";
import {ellipse} from "../../utils/parametric.js";
import Vector2D from "../../utils/vector2d.js";

onMounted(() => {
  const vertex = `
    attribute vec2 position;

    void main() {
      gl_Position = vec4(position, 1.0, 1.0);
    }
    `;
  const fragment = `
    precision mediump float;
    uniform vec4 uColor; // 片段着色器

    void main() {
      gl_FragColor = uColor;
    }
  `;

  let canvas = document.querySelector('#ellipse');
  let gl = canvas.getContext('webgl');
  let webgl = new WebGL(gl, vertex, fragment);
  const ellipseArr = {
    vertices: ellipse(0, 0, 0.5, 1)
  };
  webgl.drawPolygonTess2(ellipseArr.vertices, {color: [.5, .8, .5, 1]});

  canvas = document.querySelector('#five');
  gl = canvas.getContext('webgl');
  webgl = new WebGL(gl, vertex, fragment);
  // 构建多边形的顶点
  const points = [new Vector2D(0, 1)];
  for(let i = 1; i <= 4; i ++) {
    const p = points[0].copy().rotate(i * Math.PI * 0.4);
    points.push(p);
  }
  const fiveArr = {
    vertices: [
      points[0],
      points[2],
      points[4],
      points[1],
      points[3]
    ]
  }
  webgl.drawPolygonTess2(fiveArr.vertices, {color: [.5, .8, .5, 1]});
  // webgl.drawPolygonTess2(points, {color: [.5, .8, .5, 1], rule: WINDING_NONZERO});
});
</script>

<style scoped>
canvas {
  width: 512px;
  height: 512px;
  background: #eee;
}
</style>
