<template>
  <h3>HSV色轮</h3>
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
  uniform vec2 uMouse;

  vec2 polar(vec2 st){
    return vec2(length(st), atan(st.y, st.x));
  }

  vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp(
      abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
      0.0,
      1.0
    );
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
  }

  void main() {
    vec2 st = vUv - vec2(0.5);
    st = polar(st);
    float d = smoothstep(st.x, st.x + 0.01, 0.2);
    if(st.y < 0.0) st.y += 2.0 * 3.14;
    float p = st.y / (2.0 * 3.14);
    gl_FragColor.rgb = d * hsv2rgb(vec3(p, uMouse.x, uMouse.y));
    // gl_FragColor.rgb = d * hsv2rgb(vec3(p, 1.0, 1.0));
    gl_FragColor.a = 1.0;
  }
`;

onMounted(() => {
  const renderer = new GlRenderer(glRef.value);
  const program = renderer.compileSync(fragment, vertex);
  renderer.useProgram(program);
  renderer.uniforms.uMouse = [0.0, 0.0];
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

  glRef.value.addEventListener('mousemove', e => {
    const {offsetX: x, offsetY: y} = e;
    const {width, height} = glRef.value.getBoundingClientRect();
    renderer.uniforms.uMouse = [
        x / width,
        (height - y) / height
    ];
  });
});
</script>
