<template>
  <h3>随机粒子动画</h3>
  <canvas width="512" height="512" ref="glRef"></canvas>
</template>

<script setup>
import {onMounted, ref} from "vue";
import GlRenderer from "gl-renderer";
import {noise} from "../../utils/glslFunc.js";

const glRef = ref(null);
const vertex = `
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;

  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    vUv = uv;
    gl_Position = vec4(a_vertexPosition, 1, 1);
  }
`;
const fragment = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform float uTime;

  highp float random(vec2 co) {
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt = dot(co.xy, vec2(a, b));
    highp float sn = mod(dt, 3.14);
    return fract(sin(sn) * c);
  }

  ${noise.noise_value}

  float sdf_circle(vec2 st, vec2 c, float r) {
    return 1.0 - length(st - c) / r;
  }

  void main() {
    vec2 st = vUv;
    float rx = mix(
      -0.2,
      0.2,
      noise(vec2(7881.32, 0) + random(st) + uTime)
    );
    float ry = mix(
      -0.2,
      0.2,
      noise(vec2(0, 1433.59) + random(st) + uTime) // random(st)
    );
    float dis = distance(st, vec2(0.5)); // 和点(0.5,0.5)的距离
    dis = pow((1.0 - dis), 2.0);
    float d = sdf_circle(
      st + vec2(rx, ry), // 使用噪声形成位移
      vec2(0.5),         // 圆心
      0.2                // 半径
    );
    d = smoothstep(0.0, 1.0, d);
    gl_FragColor = vec4(dis * d * vec3(1.0), 1.0);
  }
`;

let renderer;
onMounted(() => {
  renderer = new GlRenderer(glRef.value);
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
    cells: [
        [0, 1, 2],
        [2, 0, 3]
    ]
  }]);
  renderer.uniforms.uTime = 0.0;
  requestAnimationFrame(function update(t) {
    renderer.uniforms.uTime = 0.001 * t;
    requestAnimationFrame(update);
  });
  renderer.render();
});
</script>
