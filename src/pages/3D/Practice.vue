<template>
  <h3>课后练习</h3>
  <div>
    <span
        class="filter-type"
        :class="{active: checkedTab === index}"
        @click="checkedTab = index"
        v-for="(item, index) in tabs">{{ item.name }}</span>
  </div>
  <canvas width="512" height="512" ref="glRef"></canvas>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import GlRenderer from "gl-renderer";
import {normalFromMat4} from 'ogl/src/math/functions/Mat3Func.js';
import {cuboid, fromRotation, regularTetrahedron} from "../../utils/3d.js";

const tabs = [
  {name: "长方体"},
  {name: "正四面体"},
  {name: "正四面体（点光源）"},
];

const checkedTab = ref(0);
const glRef = ref(null);

const vertex = `
  attribute vec3 a_vertexPosition;
  attribute vec4 color;

  varying vec4 vColor;
  uniform mat4 projectionMatrix;
  uniform mat4 modelMatrix;

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

const vertex2 = `
  attribute vec3 a_vertexPosition;
  attribute vec4 color;
  attribute vec3 normal;

  varying vec4 vColor;
  varying float vCos; // 点光源与法线的夹角余弦
  uniform mat4 projectionMatrix; // 投影矩阵
  uniform mat4 modelMatrix; // 模型矩阵
  uniform mat3 normalMatrix; // 法向量矩阵（模型矩阵的逆转置矩阵）

  const vec3 lightPosition = vec3(1, 0, 0); // 点光源坐标

  void main() {
    gl_PointSize = 1.0;
    vColor = color;
    vec4 pos = modelMatrix * vec4(a_vertexPosition, 1.0);
    vec3 invLight = lightPosition - pos.xyz;
    vec3 norm = normalize(normalMatrix * normal);
    vCos = max(dot(normalize(invLight), norm), 0.0);
    gl_Position = projectionMatrix * pos;
  }
`;
const fragment2 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform vec4 lightColor;

  varying vec4 vColor;
  varying float vCos;

  void main() {
    gl_FragColor.rgb = vColor.rgb + vCos * lightColor.a * lightColor.rgb;
    gl_FragColor.a = vColor.a;
  }
`;

let renderer;
onMounted(() => {
  renderer = new GlRenderer(glRef.value, {
    depth: true
  });
  drawByTab(checkedTab.value);

  watch(checkedTab, () => {
    drawByTab(checkedTab.value);
  });
});

const drawByTab = tab => {
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
  function update1() {
    rotationX += 0.003;
    rotationY += 0.005;
    rotationZ += 0.007;
    const modelMatrix = fromRotation(rotationX, rotationY, rotationZ);
    renderer.uniforms.modelMatrix = modelMatrix;
    renderer.uniforms.normalMatrix = normalFromMat4([], modelMatrix);
    requestAnimationFrame(update);
  }

  switch (tab) {
    case 0:
      const program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);
      const geometry = cuboid(0.3, 0.5, 0.8, [[0, 0.5, 0, 1], [1, 0, 0, 1], [0, 0, 1, 1]]);
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
      update();
      renderer.render();
      break;
    case 1:
      const program1 = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program1);
      const geometry1 = regularTetrahedron(0.5, [
          [1, 0, 0, 1],
          [0, 0, 1, 1],
          [0, 1, 0, 1],
          [0, 0.5, 0, 1]
      ]);
      renderer.setMeshData([{
        positions: geometry1.positions,
        attributes: {
          color: geometry1.color
        },
        cells: geometry1.cells
      }]);
      renderer.uniforms.projectionMatrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, -1, 0,
        0, 0, 0, 1
      ];
      update();
      renderer.render();
      break;
    case 2:
      const program2 = renderer.compileSync(fragment2, vertex2);
      renderer.useProgram(program2);
      const geometry2 = regularTetrahedron(0.5,[
          // [0.5, 0, 0, 1],
          // [0, 0, 0.5, 1],
          // [0, 1, 0, 1],
          // [0.5, 0.2, 0.5, 1]
          [1, 0, 0, 1],
          [0, 0, 1, 1],
          [0, 1, 0, 1],
          [0.5, 0.5, 0.5, 1]
      ]);
      renderer.setMeshData([{
        positions: geometry2.positions,
        attributes: {
          color: geometry2.color,
          normal: geometry2.normal
        },
        cells: geometry2.cells
      }]);
      renderer.uniforms.projectionMatrix = [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, -1, 0,
          0, 0, 0, 1
      ];
      renderer.uniforms.lightColor = [1, 0, 0, 0.8];
      update1();
      renderer.render();
      break;
  }
}
</script>

<style scoped>
.filter-type {
  display: inline-block;
  padding: 4px 10px;
  background-color: #646cff;
  color: #fff;
  cursor: pointer;
}
.filter-type.active {
  background-color: #4b52fc;
}
.filter-type + .filter-type {
  margin-left: 5px;
}
</style>
