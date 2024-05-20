<template>
  <h3>角向渐变</h3>
  <p>CSS</p>
  <div class="conic"></div>
  <p>WebGL</p>
  <canvas width="512" height="512" ref="glRef"></canvas>
</template>

<script setup>
import {onMounted, ref} from "vue";
import GlRenderer from 'gl-renderer';

const glRef = ref(null);

const vertex = `
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(a_vertexPosition, 1, 1);
    vUv = uv;
  }
`;
const fragment = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  vec2 polar(vec2 st){
    return vec2(length(st), atan(st.y, st.x));
  }

  void main() {
    vec2 st = vUv - vec2(0.5);
    st = polar(st);
    float d = smoothstep(st.x, st.x + 0.01, 0.2); // st.x：半径；st.x > 0.2时，d为0
    // 将角度范围转换到0到2PI之间
    if(st.y < 0.0) st.y += 2.0 * 3.14;
    // 计算p，角度归一化后的值
    float p = st.y / (2.0 * 3.14);
    if (p < 0.45) {
      // 0-0.45时，从红色线性过渡到绿色
      gl_FragColor.rgb = d * mix(vec3(1.0, 0, 0), vec3(0, 0.5, 0), p / 0.45);
    } else {
      // >0.45，从绿色过渡到蓝色
      gl_FragColor.rgb = d * mix(vec3(0, 0.5, 0), vec3(0, 0, 1.0), (p - 0.45) / (1.0 - 0.45));
    }
    gl_FragColor.a = smoothstep(st.x, st.x + 0.01, 0.2); // 0-透明 1-不透明；st.x > 0.2时，a为0
  }
`;

onMounted(() => {
  const renderer = new GlRenderer(glRef.value);
  const program = renderer.compileSync(fragment, vertex);
  renderer.useProgram(program);
  renderer.setMeshData([{
    positions: [
        [-1, -1],
        [-1, 1],
        [1, 1],
        [1, -1]
    ],
    attributes: {
      uv: [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0]
      ]
    },
    cells: [[0, 1, 2], [2, 0, 3]]
  }]);
  renderer.render();
});
</script>

<style scoped>
.conic {
  margin: auto;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: conic-gradient(red 0%, green 45%, blue);
}
</style>
