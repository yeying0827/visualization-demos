<template>
  <h3>绘制三角形</h3>
  <p>点到线段的距离</p>
  <canvas ref="glRef" width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import GlRenderer from "gl-renderer";
import roadjpeg from '@/assets/road.jpeg';

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

  // 点到直线的距离
  float line_distance(in vec2 st, in vec2 a, in vec2 b) {
    vec3 ab = vec3(b - a, 0);
    vec3 p = vec3(st - a, 0);
    return cross(p, normalize(ab)).z;
  }

  // 点到线段的距离
  float seg_distance(in vec2 st, in vec2 a, in vec2 b) {
    vec3 ab = vec3(b - a, 0);
    vec3 p = vec3(st - a, 0);
    float l = length(ab);
    float d = abs(cross(p, normalize(ab)).z);
    float proj = dot(p, ab) / l;
    if (proj >= 0.0 && proj <= l) return d;
    return min(distance(st, a), distance(st, b));
  }

  // 点与三角形的距离
  float triangle_distance(in vec2 st, in vec2 a, in vec2 b, in vec2 c) {
    float d1 = line_distance(st, a, b);
    float d2 = line_distance(st, b, c);
    float d3 = line_distance(st, c, a);

    if (d1 >= 0.0 && d2 >= 0.0 && d3 >= 0.0
      || d1 <= 0.0 && d2 <= 0.0 && d3 <= 0.0) { // 在三角形内部
      return -min(abs(d1), min(abs(d2), abs(d3))); // 负数
    }

    return min(seg_distance(st, a, b), min(seg_distance(st, b, c), seg_distance(st, c, a)));
  }

  void main() {
    float d = triangle_distance(
      vUv,
      vec2(0.3),
      vec2(0.5, 0.7),
      vec2(0.7, 0.3)
    );

    d = fract(20.0 * d);
    gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);

    gl_FragColor.a = 1.0;
  }
`;
const fragment1 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;

  void main() {
    vec4 color = texture2D(tMap, vUv);
    float d = distance(vUv, vec2(0.5, 0.5));
    // gl_FragColor.rgb = (1.0 - smoothstep(0.4, 0.4005, d)) * vec3(1.0);
    gl_FragColor.rgb = (1.0 - smoothstep(0.4, 0.4005, d)) * color.rgb;
    gl_FragColor.a = (1.0 - smoothstep(0.4, 0.4005, d));
  }
`;

let renderer, program;

onMounted(() => {
  renderer = new GlRenderer(glRef.value);
  program = renderer.compileSync(fragment, vertex);
  renderer.useProgram(program);

  // (async function() {
  //   program = renderer.compileSync(fragment1, vertex);
  //   renderer.useProgram(program);
  //   renderer.uniforms.tMap = await renderer.loadTexture(roadjpeg);
  // }());

  // 写数据并渲染
  bufferDataAndRender();
});

const bufferDataAndRender = () => {
  // 将顶点数据写入缓冲区
  // !!切换着色器之后要重新绑定缓冲区，否则会报vertex缓存空间不足
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
  // 执行渲染
  renderer.render();
};

</script>
