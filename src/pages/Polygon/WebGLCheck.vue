<template>
  <h3>WebGLCheck判断边界</h3>
  <canvas height="512" width="512"></canvas>
  <canvas height="512" width="512" id="ellipse"></canvas>
  <canvas height="512" width="512" id="five"></canvas>
</template>

<script setup>
import {onMounted} from "vue";
import parametric, {ellipse, parabola2} from "../../utils/parametric.js";
import Vector2D from "../../utils/vector2d.js";
import {earcutTriangulation, isPointInPath} from "../../utils/polygon.js";
import WebGL from "../../utils/WebGL.js";

onMounted(() => {
  let canvas = document.querySelector('canvas');
  let gl = canvas.getContext('webgl');

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

  let webgl = new WebGL(gl, vertex, fragment);

  // 星形线
  const starFun = parametric(
      (t, l) => l * Math.cos(t) ** 3,
      (t, l) => l * Math.sin(t) ** 3
  );
  const star = {
    vertices: starFun(0, Math.PI * 2, 50, 1).points
  };
  star.points = star.vertices.flat();
  star.triangles = earcutTriangulation(star.points);
  webgl.drawPolygon(star.points, star.triangles);

  const {left, top: topNum} = canvas.getBoundingClientRect();
  canvas.addEventListener('mousemove', e => {
    const {x, y} = e;
    // 坐标转化
    const offsetX = x - left;
    const offsetY = y - topNum;

    const point = new Vector2D((offsetX - canvas.width / 2) / 256, (canvas.height / 2 - offsetY) / 256); // 因为webgl坐标系和页面坐标系不一样，所以这里需要把页面上点的坐标也转换一遍，才能正常判断
    if (isPointInPath({
          vertices: star.vertices,
          cells: star.triangles
        }, point)
    ) {
      webgl.drawPolygon(star.points, star.triangles, [0, .5, 0, 1]);
      // console.log('in');
    } else {
      webgl.drawPolygon(star.points, star.triangles);
      // console.log('out');
    }
  });

  let canvas2 = document.querySelector('#ellipse');
  let gl2 = canvas2.getContext('webgl');
  let webgl2 = new WebGL(gl2, vertex, fragment);
  const ellipseArr = {
    vertices: ellipse(0, 0, 0.5, 1)
  };
  ellipseArr.points = ellipseArr.vertices.flat();
  ellipseArr.triangles = earcutTriangulation(ellipseArr.points);
  webgl2.drawPolygon(ellipseArr.points, ellipseArr.triangles, [.5, .8, .5, 1]);

  canvas2 = document.querySelector('#five');
  gl2 = canvas2.getContext('webgl');
  webgl2 = new WebGL(gl2, vertex, fragment);
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
  fiveArr.points = fiveArr.vertices.flat();
  fiveArr.triangles = earcutTriangulation(fiveArr.points);
  // console.log('earcut', fiveArr.triangles);
  webgl2.drawPolygon(fiveArr.points, fiveArr.triangles, [.5, .5, .8, 1], gl.LINE_LOOP);
});
</script>

<style scoped>
canvas {
  width: 512px;
  height: 512px;
  background: #eee;
}
</style>
