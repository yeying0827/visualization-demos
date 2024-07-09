<template>
  <h3>用WebGL绘制三维立方体</h3>
  <canvas width="512" height="512" ref="glRef"></canvas>
</template>

<script setup>
import {onMounted, ref} from "vue";
import GlRenderer from "gl-renderer";
import {cube, cuboid, cylinder, fromRotation} from "../../utils/3d.js";

const glRef = ref(null);
let renderer;

const vertex = `
  attribute vec3 a_vertexPosition; // 1:把顶点从vec2扩展到vec3
  attribute vec4 color; // 四维向量

  varying vec4 vColor;
  uniform mat4 projectionMatrix; // 2:投影矩阵-变换坐标系
  uniform mat4 modelMatrix; // 3:模型矩阵-使几何体旋转

  void main() {
    gl_PointSize = 1.0;
    vColor = color;
    gl_Position = projectionMatrix * modelMatrix * vec4(a_vertexPosition, 1.0);
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
onMounted(() => {
  renderer = new GlRenderer(glRef.value, {
    depth: true // 开启深度检测
  });

  // 立方体
  const geometry = cube(1.0, [
      [1, 0, 0, 1],   // 红
      [0, 0.5, 0, 1], // 绿
      [0, 0, 1, 1]    // 蓝
  ]);
  // 圆柱
  // const geometry = cylinder(0.5, 1.0);

  const program = renderer.compileSync(fragment, vertex);
  renderer.useProgram(program);
  renderer.setMeshData([{
    positions: geometry.positions,
    attributes: {
      color: geometry.color
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
