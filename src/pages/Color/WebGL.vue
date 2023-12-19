<template>
  <h3>WebGL色盘</h3>
  <p>利用hsv和rgb互相转换的GLSL代码，实现两个色盘</p>
  <p>左边：半径对应饱和度；右边：半径对应明度</p>
  <canvas width="512" height="512"></canvas>
  <p style="text-align: left;">CSS实现色盘</p>
  <div class="circle"></div>
</template>

<script setup>
import {onMounted} from "vue";
import WebGL from "../../utils/WebGL.js";
import {arc} from '../../utils/parametric.js';
import {earcutTriangulation} from '../../utils/polygon.js';

const vertex = `
  attribute vec2 position;

  varying vec2 vP;

  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
    vP = position;
  }
`;

const fragment = `
  #define PI 3.1415926535897932384626433832795
  precision mediump float;
  uniform vec2 uCenter; // 接收为圆心坐标

  varying vec2 vP;

  // rgb -> hsv
  vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  }

  // hsv -> rgb
  // 参数的取值范围都是 (0, 1)
  vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
  }

  void main() {
    float x0 = uCenter.x;
    float y0 = uCenter.y;
    // atan函数：以弧度返回角度的反正切；
    // https://blog.csdn.net/the_2020/article/details/124892346
    // 对于具有笛卡尔坐标 (x, y) 的点，该函数返回具有极坐标 (r, θ) 的同一点的角度 θ。
    // https://blog.csdn.net/lqzer/article/details/122016178
    // atan(y, x): arc tangent, 返回弧度 [-PI, PI];
    // https://docs.gl/el3/atan
    float h = atan(vP.y - y0, vP.x - x0); // 计算弧度
    h = h / (PI * 2.0); // 将角度转为（0，1）范围
    float r = sqrt((vP.x - x0) * (vP.x - x0) + (vP.y - y0) * (vP.y - y0)); // 计算半径

    if (x0 < 0.0) { // 左边的圆：明度固定，饱和度随半径变化
      vec3 hsv_color = vec3(h, r * 2.0, 1.0);
      vec3 rgb_color = hsv2rgb(hsv_color);
      gl_FragColor = vec4(rgb_color, 1.0);
    } else { // 右边的圆：饱和度固定，明度随半径变化
      vec3 hsv_color = vec3(h, 1.0, r * 2.0);
      vec3 rgb_color = hsv2rgb(hsv_color);
      gl_FragColor = vec4(rgb_color, 1.0);
    }
  }
`;

onMounted(() => {
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl');
  const webgl = new WebGL(gl, vertex, fragment);

  // https://syean.cn/2017/03/17/JS%E5%AE%9E%E7%8E%B0RGB-HSL-HSB%E7%9B%B8%E4%BA%92%E8%BD%AC%E6%8D%A2/
  // 色相环上的六大主色，用作基本参照：360°/0°红、60°黄、120°绿、180°青、240°蓝、300°洋红

  // 左边的园
  const arcArr = {
    vertices: arc(-0.5, 0, 0.5, 0, Math.PI * 2)
  };
  arcArr.points = arcArr.vertices.flat();
  arcArr.triangles = earcutTriangulation(arcArr.points);
  webgl.drawPolygon(
      arcArr.points,
      arcArr.triangles,
      [['uCenter', [-0.5, 0.0], '2fv']]
  );

  // 右边的圆
  arcArr.vertices = arc(0.5, 0, 0.5, 0, Math.PI * 2);
  arcArr.points = arcArr.vertices.flat();
  arcArr.triangles = earcutTriangulation(arcArr.points);
  webgl.drawPolygon(
      arcArr.points,
      arcArr.triangles,
      [['uCenter', [0.5, 0.0], '2fv']],
      undefined,
      false
  );

  let conicColor = "";
  for(let i = 0; i <= 720; i ++) {
    conicColor += `,hsl(${i * 0.5}, 100%, 50%)`;
  }
  document.querySelector('.circle').style.setProperty('--conicColor', conicColor.substring(1));
});
</script>

<style lang="less" scoped>
canvas {
  width: 512px;
  height: 512px;
  border: 1px solid #eee;
}

.circle {
  width: 256px;
  height: 256px;

  background-image: radial-gradient(closest-side, white, transparent),
    conic-gradient(var(--conicColor));
  border-radius: 50%;
  transform: scale(1, -1) rotate(90deg);
}
</style>
