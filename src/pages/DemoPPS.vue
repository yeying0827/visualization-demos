<template>
  <h3>使用后期处理通道增强图像</h3>
  <canvas ref="glRef" width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import GlRenderer from "gl-renderer";
import {distance, noise, color} from "../utils/glslFunc.js";

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

  ${distance.base}

  ${noise.random2d}

  ${color.hsb}

  void main() {
    vec2 st = vUv;
    st *= 10.0;
    vec2 i_st = floor(st);
    vec2 f_st = 2.0 * fract(st) - vec2(1);
    float r = random(i_st);
    float sign = 2.0 * step(0.5, r) - 1.0;

    float d = triangle_distance(
      f_st,
      vec2(-1),
      vec2(1),
      sign * vec2(1, -1)
    );
    gl_FragColor.rgb = (smoothstep(-0.85, -0.6, d) - smoothstep(0.0, 0.05, d)) * hsb2rgb(vec3(r + 1.2, 0.5, r));
    gl_FragColor.a = 1.0;
  }
`;
const blurFragment = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;

  void main() {
    vec4 color = texture2D(tMap, vUv);

    gl_FragColor.rgb = color.rgb;
    gl_FragColor.a = color.a;
  }
`;
const blurFragment1 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv; // 当前片元映射的纹理坐标
  uniform sampler2D tMap;
  uniform int axis; // 标记对哪个坐标轴进行高斯模糊的处理

  void main() {
    vec4 color = texture2D(tMap, vUv);

    // 高斯矩阵的权重值
    float weight[5];
    weight[0] = 0.227027;
    weight[1] = 0.1945946;
    weight[2] = 0.1216216;
    weight[3] = 0.054054;
    weight[4] = 0.016216;

    // 每一个相邻像素的坐标间隔
    float tex_offset = 1.0 / 512.0;
    vec3 result = color.rgb;
    result *= weight[0];
    for (int i = 1; i < 5; ++ i) {
      float f = float(i);
      if (axis == 0) { // X轴的高斯模糊
        result += texture2D(tMap, vUv + vec2(tex_offset * f, 0.0)).rgb * weight[i];
        result += texture2D(tMap, vUv - vec2(tex_offset * f, 0.0)).rgb * weight[i];
      } else { // Y轴的高斯模糊
        result += texture2D(tMap, vUv + vec2(0.0, tex_offset * f)).rgb * weight[i];
        result += texture2D(tMap, vUv - vec2(0.0, tex_offset * f)).rgb * weight[i];
      }
    }

    gl_FragColor.rgb = result.rgb;
    gl_FragColor.a = color.a;
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
    cells: [
      [0, 1, 2],
      [2, 0, 3]
    ]
  }]);
  // const fbo = renderer.createFBO();
  // renderer.bindFBO(fbo);
  // renderer.render();
  // const blurProgram = renderer.compileSync(blurFragment, vertex);
  // renderer.useProgram(blurProgram);
  // renderer.setMeshData(program.meshData);
  // renderer.bindFBO(null);
  // renderer.uniforms.tMap = fbo.texture;
  // renderer.render();
  // 交替使用
  const fbo1 = renderer.createFBO();
  const fbo2 = renderer.createFBO();
  // 第一次渲染，生成初始纹理
  renderer.bindFBO(fbo1);
  renderer.render();
  const blurProgram = renderer.compileSync(blurFragment1, vertex);
  renderer.useProgram(blurProgram);
  renderer.setMeshData(program.meshData);
  // 第二次，对X轴高斯模糊
  renderer.bindFBO(fbo2);
  renderer.uniforms.tMap = fbo1.texture;
  renderer.uniforms.axis = 0;
  renderer.render();
  // 第三次，对Y轴高斯模糊
  renderer.bindFBO(fbo1);
  renderer.uniforms.tMap = fbo2.texture;
  renderer.uniforms.axis = 1;
  renderer.render();
  // 第4次
  renderer.bindFBO(fbo2);
  renderer.uniforms.tMap = fbo1.texture;
  renderer.uniforms.axis = 0;
  renderer.render();
  // 第5，对Y轴高斯模糊
  renderer.bindFBO(null);
  renderer.uniforms.tMap = fbo2.texture;
  renderer.uniforms.axis = 1;
  renderer.render();
});
</script>
