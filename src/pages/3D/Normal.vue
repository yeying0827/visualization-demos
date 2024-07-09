<template>
  <h3>法向量的使用：点光源光照效果</h3>
  <canvas width="512" height="512" ref="glRef"></canvas>
</template>

<script setup>
import {onMounted, ref} from "vue";
import GlRenderer from "gl-renderer";
import {cube, cylinder, fromRotation} from "../../utils/3d.js";
import {normalFromMat4} from 'ogl/src/math/functions/Mat3Func.js';

const glRef = ref(null);
let renderer;

const vertex = `
  attribute vec3 a_vertexPosition; // 1:把顶点从vec2扩展到vec3
  attribute vec4 color; // 四维向量
  attribute vec3 normal; // 4:法向量

  varying vec4 vColor;
  varying float vCos; // 点光源与法线的夹角余弦
  uniform mat4 projectionMatrix; // 2:投影矩阵-变换坐标系
  uniform mat4 modelMatrix; // 3:模型矩阵-使几何体旋转等变换
  uniform mat3 normalMatrix; // 4:法向量矩阵（模型矩阵的逆转置矩阵）

  const vec3 lightPosition = vec3(1, 0, 0); // 点光源坐标

  void main() {
    gl_PointSize = 1.0;
    vColor = color;
    vec4 pos = modelMatrix * vec4(a_vertexPosition, 1.0);
    vec3 invLight = lightPosition - pos.xyz;
    vec3 norm = normalize(normalMatrix * normal); // 法向量矩阵 乘以 法向量 => 变换后的法向量
    vCos = max(dot(normalize(invLight), norm), 0.0); // （归一化后的）光源向量与法向量的点积
    gl_Position = projectionMatrix * pos;
  }
`;
const fragment = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform vec4 lightColor;

  varying vec4 vColor;
  varying float vCos;

  void main() {
    gl_FragColor.rgb = vColor.rgb + vCos * lightColor.a * lightColor.rgb; // 叠加光照
    gl_FragColor.a = vColor.a;
  }
`;
onMounted(() => {
  renderer = new GlRenderer(glRef.value, {
    depth: true // 开启深度检测
  });

  // 立方体
  // const geometry = cube(1.0, [
  //     [1, 0, 0, 1],   // 红
  //     [0, 0.5, 0, 1], // 绿
  //     [0, 0, 1, 1]    // 蓝
  // ]);
  // 圆柱
  const geometry = cylinder(0.5, 1.0, 30, [0, 0, 1, 1], [0.5, 0.5, 0.5, 1]);
  const program = renderer.compileSync(fragment, vertex);
  renderer.useProgram(program);
  renderer.setMeshData([{
    positions: geometry.positions,
    attributes: {
      color: geometry.color,
      normal: geometry.normal,
    },
    cells: geometry.cells
  }]);
  renderer.uniforms.projectionMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, -1, 0,
    0, 0, 0, 1
  ];
  renderer.uniforms.lightColor = [1, 0, 0, 0.8];
  let rotationX = 0;
  let rotationY = 0;
  let rotationZ = 0;
  // let count = 0;
  function update() {
    rotationX += 0.003;
    rotationY += 0.005;
    rotationZ += 0.007;
    const modelMatrix = fromRotation(rotationX, rotationY, rotationZ);
    // if (count === 0) {
    //   console.log(modelMatrix);
    //   console.log(normalFromMat4([], modelMatrix));
    //   count ++;
    // }
    renderer.uniforms.modelMatrix = modelMatrix;
    renderer.uniforms.normalMatrix = normalFromMat4([], modelMatrix);
    requestAnimationFrame(update);
  }
  update();
  renderer.render();
});
</script>
