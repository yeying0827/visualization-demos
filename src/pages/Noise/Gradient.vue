<template>
  <h3>梯度噪声</h3>
  <canvas ref="glRef" width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import GlRenderer from "gl-renderer";

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

  vec2 random2(vec2 st) {
    st = vec2(
      dot(st, vec2(127.1, 311.7)),
      dot(st, vec2(269.5, 183.3))
    );
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123); // x和y：-1~1
  }

  // Gradient Noise by Inigo Quilez - iq/2013
  // https://www.shadertoy.com/view/XdXGW8
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f); // 0~1

    return mix(
      mix(
        dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)),
        u.x
      ),
      mix(
        dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)),
        u.x
      ),
      u.y
    );
  }

  void main() {
    vec2 st = vUv * 20.0;
    gl_FragColor.rgb = vec3(0.5 * noise(st) + 0.5);
    gl_FragColor.a = 1.0;
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
