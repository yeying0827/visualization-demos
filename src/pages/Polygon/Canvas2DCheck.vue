<template>
  <h3>Canvas2D判断边界</h3>
  <canvas width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted} from "vue";
import Vector2D from "../../utils/vector2d.js";
import Canvas2D from "../../utils/Canvas.js";
import {earcutTriangulation, isPointInPath} from "../../utils/polygon.js";

onMounted(() => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const canvas2d = new Canvas2D(ctx);

  const vertices = [
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
  const positions = vertices.map(p => [p[0] * 256, p[1] * 256]);
  const points = positions.flat();
  const triangles = earcutTriangulation(points);

  canvas2d.fillPolygon(positions);
  canvas2d.fillPolygon([[100, 100], [100, 200], [150, 200]], {fillStyle: "blue"});

  const {left, top: topNum} = canvas.getBoundingClientRect();
  canvas.addEventListener('mousemove', e => {
    const {x: x, y: y} = e;
    // 坐标转化
    const offsetX = x - left;
    const offsetY = y - topNum;
    ctx.clearRect(-256, -256, 512, 512);
    // if (/* ctx. */isPointInPath2(offsetX, offsetY)) {
    //   canvas2d.fillPolygon(positions, {fillStyle: "green"});
    //   canvas2d.fillPolygon([[100, 100], [100, 200], [150, 200]], {fillStyle: "orange"});
    // } else {
    //   canvas2d.fillPolygon(positions);
    //   canvas2d.fillPolygon([[100, 100], [100, 200], [150, 200]], {fillStyle: "blue"});
    // }
    const point = new Vector2D((offsetX - canvas.width / 2), (canvas.height / 2 - offsetY)); // 因为Canvas经过坐标转换，所以这里需要把页面上点的坐标也转换一遍，才能正常判断
    if (isPointInPath({
          vertices: [[100, 100], [100, 200], [150, 200]],
          cells: [0, 1, 2]
        }, point)
        ||
        isPointInPath({
          vertices: positions,
          cells: triangles
        }, point)
    ) {
      canvas2d.fillPolygon(positions, {fillStyle: "green"});
      canvas2d.fillPolygon([[100, 100], [100, 200], [150, 200]], {fillStyle: "orange"});
    } else {
      canvas2d.fillPolygon(positions);
      canvas2d.fillPolygon([[100, 100], [100, 200], [150, 200]], {fillStyle: "blue"});
    }
  });

  function isPointInPath2(x, y) {
    // 根据ctx重新clone一个新的Canvas对象
    const cloned =  ctx.canvas.cloneNode().getContext('2d');
    const cloned2d = new Canvas2D(cloned);
    let ret = false;
    // 绘制多边形，判断点是否在图形内部
    cloned2d.fillPolygon(positions, {fillStyle: "red"});
    ret |= cloned.isPointInPath(x, y);
    if (!ret) {
      // 如果不在，继续绘制小三角形，判断点是否在图形内部
      cloned2d.fillPolygon([[100, 100], [100, 200], [150, 200]], {fillStyle: "blue"});
      ret |= cloned.isPointInPath(x, y);
    }
    return ret;
  }
});
</script>

<style scoped>
canvas {
  width: 512px;
  height: 512px;
  border: 1px solid #eee;
}
</style>
