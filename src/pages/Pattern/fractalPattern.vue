<template>
  <h3>分形图案</h3>
  <canvas width="512" height="512" id="fractal"></canvas>
</template>

<script setup>
import {onMounted} from "vue";
import GlRenderer from 'gl-renderer';

const fragment = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  varying vec2 vUv;
  uniform vec2 center;
  uniform float scale;
  uniform int iterations;

  vec2 f(vec2 z, vec2 c) {
    return mat2(z, -z.y, z.x) * z + c;
  }

  // vec3 palette(float t, vec3 c1, vec3 c2, vec3 c3, vec3 c4) {
  //   float x = 1.0 / 3.0;
  //   if (t < x) return mix(c1, c2, t/x);
  //   else if (t < 2.0 * x) return mix(c2, c3, (t - x)/x);
  //   else if (t < 3.0 * x) return mix(c3, c4, (t - 2.0*x)/x);
  //   return c4;
  // }

  void main() {
    vec2 uv = vUv;
    // 设置初始的z和c，然后执行迭代。
    vec2 c = center + 4.0 * (uv - vec2(0.5)) / scale;
    vec2 z = vec2(0.0);

    bool escaped = false;
    int j;
    // 给一个足够精度的最大迭代次数：65536
    for (int i = 0; i < 65536; i ++) {
      if (i > iterations) break;
      j = i;
      z = f(z, c);
      if (length(z) > 2.0) { // 如果z的模大于2，就结束计算；否则就继续迭代，直到达到循环次数
        escaped = true;
        break;
      }
    }

    // gl_FragColor.rgb = escaped ? vec3(float(j)) / float(iterations) : vec3(0.0);
    gl_FragColor.rgb = escaped ? vec3(float(j)) / sqrt(float(iterations)) : vec3(0.0);
    // gl_FragColor.rgb = escaped ? vec3(float(j)) + float(iterations) : vec3(0.0);
    // gl_FragColor.rgb = escaped ? vec3(float(j)) * float(iterations) : vec3(0.0);
    // gl_FragColor.rgb = escaped ? vec3(1.0) : vec3(0.0);

    // 配合update()动态变化看效果
    // gl_FragColor.rgb = escaped ? max(1.0, log(scale)) * palette(float(j)/ float(iterations), vec3(0.02, 0.02, 0.03), vec3(0.1, 0.2, 0.3), vec3(0.0, 0.3, 0.2), vec3(0.0, 0.5, 0.8))
    //          : vec3(0.0);
    gl_FragColor.a = 1.0;
  }
`;

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

onMounted(() => {
  // 第一步：创建Renderer对象
  const canvas = document.querySelector('#fractal');
  const renderer = new GlRenderer(canvas);
  // 第二步：创建并启用WebGL程序
  const program = renderer.compileSync(fragment, vertex);
  renderer.useProgram(program);
  // 第三步：设置uniform变量
  renderer.uniforms.center = [0, 0]; // 设置(0,0)为图案中心点
  // renderer.uniforms.center = [0.367, 0.303]; // 设置(0.367, 0.303)为图案中心点（配合update()动态变化看效果）
  renderer.uniforms.scale = 1; // 放大系数初始值为1，即原始大小
  renderer.uniforms.iterations = 256;
  // 第四步：将顶点数据送入缓冲区
  renderer.setMeshData([{
    positions: [ // 顶点（覆盖整个画布）
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
  // 第五步：执行渲染
  renderer.render();

  // function update() {
  //   const factor = Math.max(0.1, Math.log(renderer.uniforms.scale));
  //   renderer.uniforms.scale = (renderer.uniforms.scale += factor) % 10000;
  //   renderer.uniforms.iterations = factor * 500;
  //   requestAnimationFrame(update);
  // }
  // setTimeout(update, 2000);
});
</script>

<style scoped>
#fractal {
  background-color: #fff;
}
</style>

