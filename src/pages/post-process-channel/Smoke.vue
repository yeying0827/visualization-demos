<template>
  <h3>烟雾效果</h3>
  <canvas width="512" height="512" ref="glRef"></canvas>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import GlRenderer from "gl-renderer";
import {noise} from "../../utils/glslFunc.js";

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

  void main() {
    vec2 st = vUv - vec2(0.5);
    float d = length(st);
    gl_FragColor.rgb = vec3(1.0 - smoothstep(0.05, 0.055, d));
    gl_FragColor.a = 1.0;
  }
`;
const fragment1 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap; // 用于后期处理
  uniform float uTime; // 控制图像随时间变化

  ${noise.noise_gradient}

  void main() {
    vec3 smoke = vec3(0);
    if (uTime <= 0.0) { // 判断是第一次还是后续的叠加过程
      vec2 st = vUv - vec2(0.5);
      float d = length(st);
      smoke = vec3(step(d, 0.05));
      // smoke = vec3(1.0 - smoothstep(0.05, 0.055, d));
    }

    vec2 st = vUv;
    // st.y -= 0.001; // 取当前纹理坐标稍微下方一点的像素点

    vec3 diffuse = texture2D(tMap, st).rgb;
    float offset = 1.0 / 256.0;

    vec4 left  = texture2D(tMap, st + vec2(-offset, 0.0));
    vec4 right = texture2D(tMap, st + vec2(offset, 0.0));
    vec4 up    = texture2D(tMap, st + vec2(0.0, -offset));
    vec4 down  = texture2D(tMap, st + vec2(0.0, offset));

    float rand = noise(st + 5.0 * uTime); // -1~1
    float diff = 8.0 * 0.016 * (
      (1.0 + rand) * left.r +
      (1.0 - rand) * right.r +
      down.r +
      2.0 * up.r -
      5.0 * diffuse.r
    );

    gl_FragColor.rgb = (diffuse + diff) + smoke;
    gl_FragColor.a = 1.0;
  }
`;

onMounted(() => {
  const renderer = new GlRenderer(glRef.value);
  // const program = renderer.compileSync(fragment, vertex);
  const program = renderer.compileSync(fragment1, vertex);
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
  // renderer.render();
  const fbo = {
    readFBO: renderer.createFBO(), // 读取的缓冲
    writeFBO: renderer.createFBO(), // 写入的缓冲
    get texture() {
      return this.readFBO.texture;
    },
    swap() {
      const tmp = this.writeFBO;
      this.writeFBO = this.readFBO;
      this.readFBO = tmp;
    }
  };
  function update(t) {
    // 输出到画布
    renderer.bindFBO(null);
    renderer.uniforms.uTime = t / 1000;
    renderer.uniforms.tMap = fbo.texture; // 从readFBO读取纹理
    renderer.render();
    // 输出到FBO
    renderer.bindFBO(fbo.writeFBO); // 向writeFBO写入纹理
    renderer.uniforms.tMap = fbo.texture;
    fbo.swap(); // 交换读写缓冲以便下次写入
    renderer.render();
    requestAnimationFrame(update);
  }
  update(0);
});
</script>
