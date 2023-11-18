<template>
  <canvas width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted} from "vue";
import WebGL from "../../utils/WebGL.js";

onMounted(() => {
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl');

  const vertex = `
    attribute vec2 position;

    void main() {
      gl_PointSize = 1.0;
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

  function createCircleVertex(x, y, r, n) {
    const sin = Math.sin;
    const cos = Math.cos;
    const perAngle = (2 * Math.PI) / n;
    const positionArray = [];
    for(let i = 0; i < n; i ++) {
      const angle = i * perAngle;
      const nx = x + r * cos(angle);
      const ny = y + r * sin(angle);
      positionArray.push(nx, ny);
    }
    return new Float32Array(positionArray);
  }

  function create2CircleVertex(x, y, r, R, n) {
    const sin = Math.sin;
    const cos = Math.cos;
    const perAngle = Math.PI / n;
    const positionArray = [];
    const length = 2 * n;
    for (let i = 0; i < length; i ++) {
      const angle = i* perAngle;
      if (i & 1) {
        const Rx = x + R * cos(angle);
        const Ry = y + R * sin(angle);
        positionArray.push(Rx, Ry);
      } else {
        const rx = x + r * cos(angle);
        const ry = y + r * sin(angle);
        positionArray.push(rx, ry);
      }
    }
    return new Float32Array(positionArray);
  }
  // const points = createCircleVertex(0, 0, 0.5, 4);
  // const points = createCircleVertex(0, 0, 0.5, 5);
  const points = create2CircleVertex(0, 0, 0.3, 0.6, 6);
  /* new Float32Array([
    -1, -1,
    -1, 1,
    1, 1,
    1, -1
  ]); */
  // webgl.drawSimple(points, gl.TRIANGLE_FAN);
  webgl.drawSimple(points);
});
</script>

<style scoped>
canvas {
  height: 256px;
  width: 256px;
}
</style>
