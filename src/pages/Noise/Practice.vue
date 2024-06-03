<template>
  <h3>课后练习</h3>
  <canvas ref="glRef" width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';
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
  uniform float uTime;

  vec2 random2(vec2 st) {
    st = vec2(
      dot(st, vec2(127.1, 311.7)),
      dot(st, vec2(269.5, 183.3))
    );
    return fract(sin(st) * 43758.5453123); // x和y：0~1
  }

  void main() {
    vec2 st = vUv * 3.0;

    float d = 1.0;
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float md = 1.0;
    vec2 mg, mr; // mg: 最小距离特征点所在网格 与 当前片元所在网格 的相对偏移

    vec3 color = vec3(.0);

    for (int i = -1; i <= 1; i ++) {
      for (int j = -1; j <= 1; j ++) {
        vec2 neighbor = vec2(float(i), float(j)); // 坐标x和y：-1~1
        vec2 p = random2(i_st + neighbor); // 9个随机特征点在自身网格内的坐标（坐标x和y：0~1）
        p = 0.5 + 0.5 * sin(uTime + 6.2831 * p);
        vec2 r = neighbor + p - f_st; // 特征点与当前点的向量，neighbor+p（坐标X和Y：-1~2）
        float m_dist = length(r); // 两个点之间的距离
        if (md > m_dist) {
          mg = neighbor; // 保存最小距离时的网格偏移
          mr = r;        // 保存特征点 与 当前片元 的向量
          md = m_dist;   // 保存最小距离（当前点和9个随机特征点 最近的距离）
        }
      }
    }

    // 计算出当前片元，与9个特征点，与距离最近的特征点之间的向量关系算法
    for (int i = -1; i <= 1; i ++) {
      for (int j = -1; j <= 1; j ++) {
        vec2 neighbor = vec2(float(i), float(j)); // 坐标x和y：-1~1
        vec2 p = random2(i_st + neighbor); // 9个随机特征点在自身网格内的坐标（坐标x和y：0~1）
        p = 0.5 + 0.5 * sin(uTime + 6.2831 * p);
        vec2 r = neighbor + p - f_st; // 当前点 到 特征点的向量
        // 0.00001是做精度处理
        // if (dot(mr - r, mr - r) > 0.00001) {
          // mr: 当前片元 到 最短距离的特征点 的向量，     r: 当前片元 到 某个特征点 的向量
          // mr - r：某个特征点 到 最短距离特征点 的向量
          // r - mr: 最短距离特征点 到 某个特征点 的向量
          // 思路：利用三角形外心计算
          // 其他特征点到最小距离特征点形成向量a1 = r - mr， 片元到a1中心点形成向量a2 = (mr + r) / 2
          // 则a2在a1上面的投影（点乘）就是距离场，求这个距离场的最小距离
          d = min(d, dot(0.5 * (mr + r), normalize(r - mr)));
        // }
      }
    }

    // 等高线
    color = d * fract(d * 13.5) * vec3(1.0);
    // 边框线
    color = mix(vec3(1.0), color, smoothstep(0.01, 0.02, d));
    // 标记特征点
    color += step(length(mr), 0.02);

    gl_FragColor.rgb = color;
    gl_FragColor.a = 1.0;
  }
`;

let renderer, program;
onMounted(() => {
  renderer = new GlRenderer(glRef.value);
  drawByTab(0);
  // 写数据并渲染
  bufferDataAndRender();
});

const drawByTab = tab => {
  switch (tab) {
    case 0:
      program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);
      renderer.uniforms.uTime = 0.0;
      requestAnimationFrame(function update(t) {
        renderer.uniforms.uTime = 0.001 * t;
        requestAnimationFrame(update);
      });
      break;
  }
}

const bufferDataAndRender = () => {
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
}
</script>
