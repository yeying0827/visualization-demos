<template>
  <h3>使用WebGL绘制3D物体</h3>
  <canvas width="512" height="512" ref="glRef"></canvas>
</template>

<script setup>
import {onMounted, ref} from "vue";
import GlRenderer from "gl-renderer";
import {cube, fromRotation} from "../../utils/3d-demo.js";

const vertex = `
  attribute vec3 a_vertexPosition;
  attribute vec4 color;
  uniform mat4 projectionMatrix; // 投影矩阵
  uniform mat4 modelMatrix; // 模型矩阵

  varying vec4 vColor;

  void main() {
    gl_PointSize = 1.0;
    vColor = color;
    gl_Position = projectionMatrix * modelMatrix * vec4(a_vertexPosition, 1);
  }
`;
const fragment = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec4 vColor;

  void main() {
    gl_FragColor = vColor;
  }
`;

const glRef = ref(null);
onMounted(() => {
  const renderer = new GlRenderer(glRef.value, {
    depth: true
  });
  const program = renderer.compileSync(fragment, vertex);
  renderer.useProgram(program);
  // renderer.setMeshData([{
  //   positions: [
  //       [-0.5, -0.5],
  //       [-0.5, 0.5],
  //       [0.5, 0.5],
  //       [0.5, -0.5]
  //   ],
  //   attributes: {
  //     color: [
  //         [1, 0, 0, 1],
  //         [1, 0, 0, 1],
  //         [1, 0, 0, 1],
  //         [1, 0, 0, 1]
  //     ]
  //   },
  //   cells: [[0, 1, 2], [2, 0, 3]]
  // }]);
  const geometry = cube(1.0, [
      [1, 0, 0, 1], // 红
      [0, 0.5, 0, 1], // 绿
      [0, 0, 1, 1] // 蓝
  ]);
  renderer.setMeshData([{
    positions: geometry.positions,
    attributes: {
      color: geometry.color,
    },
    cells: geometry.cells
  }]);
  renderer.uniforms.projectionMatrix = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, -1, 0,
      0, 0, 0, 1
  ];
  let rotationX = 0;
  let rotationY = 0;
  let rotationZ = 0;
  function update() {
    rotationX += 0.003;
    rotationY += 0.005;
    rotationZ += 0.007;
    renderer.uniforms.modelMatrix = fromRotation(rotationX, rotationY, rotationZ);
    requestAnimationFrame(update);
  }
  update();
  renderer.render();
});
</script>
