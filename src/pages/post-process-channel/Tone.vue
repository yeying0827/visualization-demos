<template>
  <h3>辉光效果（使用Tone Mapping方法）：对特定元素进行高斯模糊</h3>
  <canvas height="512" width="512" ref="glRef"></canvas>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import GlRenderer from "gl-renderer";
import {distance, noise, color} from "../../utils/glslFunc.js";

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
const blurFragment1 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv; // 当前片元映射的纹理坐标
  uniform sampler2D tMap;
  uniform int axis; // 标记对哪个坐标轴进行高斯模糊的处理
  uniform float filter; // 将颜色亮度大于 filter 值的片元过滤出来添加高斯模糊

  void main() {
    vec4 color = texture2D(tMap, vUv);

    float brightness = dot(
      color.rgb,
      vec3(0.2126, 0.7152, 0.0722)
    );
    brightness = step(filter, brightness);

    // 高斯矩阵的权重值
    float weight[5];
    weight[0] = 0.227027;
    weight[1] = 0.1945946;
    weight[2] = 0.1216216;
    weight[3] = 0.054054;
    weight[4] = 0.016216;

    // 每一个相邻像素的坐标间隔，这里的512可以用实际的Canvas像素宽代替
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

    gl_FragColor.rgb = brightness * result.rgb;
    gl_FragColor.a = color.a;
  }
`;
// 用于做最后的效果混合。
// 使用Tone Mapping（色调映射）的方法：
// 将对比度过大的图像色调映射到合理的范围。
const bloomFragment = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform sampler2D tMap;
  uniform sampler2D tSource;

  varying vec2 vUv;

  void main() {
    vec3 color = texture2D(tSource, vUv).rgb;
    vec3 bloomColor = texture2D(tMap, vUv).rgb;
    color += bloomColor;
    // tone mapping 色调映射
    float exposure = 2.0;
    float gamma = 1.3;
    vec3 result = vec3(1.0) - exp(-color * exposure);
    // also gamma correct while we're at it
    if (length(bloomColor) > 0.0) {
      result = pow(result, vec3(1.0 / gamma));
    }
    gl_FragColor.rgb = result;
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
    cells: [
      [0, 1, 2],
      [2, 0, 3]
    ]
  }]);

  // 创建三个FBO对象，fbo1和fbo2交替使用
  const fbo0 = renderer.createFBO();
  const fbo1 = renderer.createFBO();
  const fbo2 = renderer.createFBO();
  // 第一次，渲染原始图形
  renderer.bindFBO(fbo0);
  renderer.render();
  const blurProgram1 = renderer.compileSync(blurFragment1, vertex);
  const bloomProgram = renderer.compileSync(bloomFragment, vertex);
  // 第二次，对X轴高斯模糊
  renderer.useProgram(blurProgram1);
  renderer.setMeshData(program.meshData);
  renderer.bindFBO(fbo2);  // 绑定帧缓冲对象
  renderer.uniforms.tMap = fbo0.texture;
  renderer.uniforms.axis = 0;
  renderer.uniforms.filter = 0.7; // 颜色亮度>0.7添加高斯模糊
  renderer.render(); // 将第二次的绘制结果输出到帧缓冲对象
  // 第三次，对Y轴高斯模糊
  renderer.useProgram(blurProgram1);
  renderer.bindFBO(fbo1);
  renderer.uniforms.tMap = fbo2.texture;
  renderer.uniforms.axis = 1;
  renderer.uniforms.filter = 0; // 颜色亮度>0添加高斯模糊
  renderer.render(); // 将第三次的绘制结果输出到帧缓冲对象
  // 第四次，对X轴高斯模糊
  renderer.useProgram(blurProgram1);
  renderer.bindFBO(fbo2);
  renderer.uniforms.tMap = fbo1.texture;
  renderer.uniforms.axis = 0;
  renderer.uniforms.filter = 0; // 颜色亮度>0添加高斯模糊
  renderer.render(); // 将第四次的绘制结果输出到帧缓冲对象
  // 第五次，对Y轴高斯模糊
  renderer.useProgram(blurProgram1);
  renderer.bindFBO(fbo1);
  renderer.uniforms.tMap = fbo2.texture;
  renderer.uniforms.axis = 1;
  renderer.uniforms.filter = 0; // 颜色亮度>0添加高斯模糊
  renderer.render(); // 将第五次的绘制结果输出到帧缓冲对象
  // 第六次，叠加辉光
  renderer.useProgram(bloomProgram);
  renderer.setMeshData(program.meshData);
  renderer.bindFBO(null);
  renderer.uniforms.tSource = fbo0.texture;
  renderer.uniforms.tMap = fbo1.texture;
  renderer.render();
});
</script>
