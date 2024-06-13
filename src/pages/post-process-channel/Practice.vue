<template>
  <h3>课后练习</h3>
  <div>
    <span
        class="filter-type"
        :class="{active: checkedTab === index}"
        @click="checkedTab = index"
        v-for="(item, index) in tabs">{{ item.name }}</span>
  </div>
  <canvas width="512" height="512" ref="glRef"></canvas>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';
import GlRenderer from "gl-renderer";
import {color, noise} from "../../utils/glslFunc.js";

const tabs = [
  {name: "烟雾效果（+风向风速）"},
  {name: "烟雾效果（随鼠标移动）"},
  {name: "探照灯"},
];

const checkedTab = ref(0);

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

  #define PI 3.1415926

  varying vec2 vUv;
  uniform sampler2D tMap; // 用于后期处理
  uniform float uTime; // 控制图像随时间变化

  ${noise.random2d}
  ${noise.noise_gradient}

  void main() {
    vec3 smoke = vec3(0);
    if (uTime <= 0.0) { // 判断是第一次还是后续的叠加过程
      vec2 st = vUv - vec2(0.5);
      float d = length(st);
      // smoke = vec3(step(d, 0.05));
      smoke = vec3(1.0 - smoothstep(0.05, 0.055, d));
    }

    vec2 st = vUv;
    // st.y -= 0.001; // 取当前纹理坐标稍微下方一点的像素点

    vec3 diffuse = texture2D(tMap, st).rgb;
    float offset = 1.0 / 256.0;

    // float rx = noise(vec2(5.0 * uTime));
    float rx = random(vec2(10.0 + (2.0 * step(1.0, uTime) - 1.0) * floor(uTime / 1.0)) );
    float ry = noise(vec2(rx));
    float kx = sin(2.0 * PI * rx);
    // float ky = sin(2.0 * PI * ry);
    float ky = 0.5 * sin(2.0 * PI * ry) + 0.5;
    float vx = 1.0;
    float vy = 5.0;
    vec2 wind = vec2(kx * vx, ky * vy);
    float dl = 0.0, dr = 0.0, du = 0.0, dd = 0.0;
    if (wind.x > 0.0) dl = wind.x;
    else dr = -wind.x;
    if (wind.y > 0.0) du = wind.y;
    else dd = -wind.y;

    vec4 left  = texture2D(tMap, st + vec2(-offset, 0.0));
    vec4 right = texture2D(tMap, st + vec2(offset, 0.0));
    vec4 up    = texture2D(tMap, st + vec2(0.0, -offset));
    vec4 down  = texture2D(tMap, st + vec2(0.0, offset));

    // 参考网友
    // https://github.com/IDonotK/graphics/blob/master/homework/h17/index1.html
    float rand = 5.0 * noise(st + 5.0 * uTime);
    float diff = 10.0 * 0.016 * (
      (1.0 + rand + dl) * left.r +
      (1.0 - rand + dr) * right.r +
      (1.0 + dd) * down.r +
      (1.0 + du) * up.r -
      (4.0 + dl + dr + dd + du) * diffuse.r
    );

    // 自己瞎写
    // float rand = 5.0 * noise(st + 5.0 * uTime);
    // float dir = 0.5 * random(st + 0.5 * uTime); // direction
    // float s = 20.0 * random(st + 1.2 * uTime); // speed
    // float diff = s * 0.016 * (
    //   (1.0 - rand + dir) * left.r +
    //   (1.0 + rand - dir) * right.r +
    //   1.001 * down.r +
    //   2.0 * up.r -
    //   5.0 * diffuse.r
    // );

    gl_FragColor.rgb = (diffuse + diff) + smoke;
    gl_FragColor.a = 1.0;
  }
`;
const fragment2 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;
  uniform float isMouseDown;
  uniform vec2 mousePos;

  float PI = 3.141592653;

  ${noise.random2d}

  ${noise.noise_gradient}

  void main() {
    vec3 smoke = vec3(0);
    if (isMouseDown > 0.0) { // 鼠标点击标记
      vec2 st = vUv - mousePos;
      float d = length(st);
      smoke = vec3(step(d, 0.025));
    }

    vec2 st = vUv;

    float offset = 1.0 / 256.0;
    vec3 diffuse = texture2D(tMap, st).rgb;

    vec4 left = texture2D(tMap, st + vec2(-offset, 0.0));
    vec4 right = texture2D(tMap, st + vec2(offset, 0.0));
    vec4 up = texture2D(tMap, st + vec2(0.0, -offset));
    vec4 down = texture2D(tMap, st + vec2(0.0, offset));

    float rand = noise(st + 5.0 * uTime);
    float diff = 8.0 * 0.016 * (
      (1.0 + rand) * left.r +
      (1.0 - rand) * right.r +
      down.r +
      3.0 * up.r -
      6.0 * diffuse.r
    );

    float minimum = 0.003;
    if(diff >= -minimum && diff < 0.0) {
      diff = -minimum;
    }

    gl_FragColor.rgb = (diffuse + diff) + smoke;
    gl_FragColor.a = 1.0;
  }
`;
const fragment1 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform int stage;
  uniform vec2 u_mouse;
  uniform sampler2D tSource;

  ${noise.random2d}

  ${color.hsb}

  void main() {
    vec2 st = vUv * 10.0;
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    vec3 color = vec3(.0);
    if (stage == 0) {
      color = hsb2rgb(vec3(random(i_st), 1, 1));
      float d_grid = (step(0.05, f_st.x) - step(0.95, f_st.x)) * (step(0.05, f_st.y) - step(0.95, f_st.y));
      color *= mix(vec3(0.0), color, d_grid);
    } else if (stage == 1) {
      color = vec3(.0);
    } else if (stage == 2) {
      float d = distance(vUv, u_mouse);
      color = ((1.0 - smoothstep(0.15, 0.25, d)) * texture2D(tSource, vUv)).rgb;
      // if(length(color) > 0.0) color *= 0.88;
    }

    gl_FragColor.rgb = color;
    gl_FragColor.a = 1.0;
  }
`;

let renderer;
onMounted(() => {
  renderer = new GlRenderer(glRef.value);
  drawByTab(checkedTab.value);
  // 写数据
  bufferData();

  watch(checkedTab, () => {
    drawByTab(checkedTab.value);
  });
});

const drawByTab = tab => {
  switch (tab) {
    case 0:
      const program0 = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program0);
      // 写数据
      bufferData();
      (function () {
        // fbo操作封装
        const fbo = customFBO();
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
      }());
      break;
    case 1:
      const program2 = renderer.compileSync(fragment2, vertex);
      renderer.useProgram(program2);
      // 写数据
      bufferData();
      (function () {
        // fbo操作封装
        const fbo = customFBO();
        const { width, height } = glRef.value;
        const rect = glRef.value.getBoundingClientRect();
        let isMouseDown = false;
        let mousePos = [0, 0];
        const updateMousePos = e => {
          const x = (e.clientX - rect.left) / width;
          const y = (height - (e.clientY - rect.top)) / height;
          mousePos = [x, y];
        }
        glRef.value.addEventListener('mousedown', e => {
          updateMousePos(e);
          glRef.value.addEventListener('mousemove', updateMousePos);
          isMouseDown = true;
        });
        glRef.value.addEventListener('mouseup', e => {
          isMouseDown = false;
          glRef.value.removeEventListener('mousemove', updateMousePos);
        });

        renderer.uniforms.isMouseDown = 0;
        renderer.uniforms.mousePos = [0, 0];
        function update(t) {
          if (isMouseDown) { // 如果鼠标按下 => 动态更新鼠标位置
            renderer.uniforms.mousePos = mousePos;
            if (!renderer.uniforms.isMouseDown) {
              renderer.uniforms.isMouseDown = 1;
            }
          } else { // 如果鼠标松开
            if (renderer.uniforms.isMouseDown) {
              renderer.uniforms.isMouseDown = 0;
            }
          }

          renderer.bindFBO(null);
          renderer.uniforms.uTime = t / 1000;
          renderer.uniforms.tMap = fbo.texture;
          renderer.render();

          renderer.bindFBO(fbo.writeFBO);
          renderer.uniforms.tMap = fbo.texture;
          renderer.render();

          fbo.swap();

          requestAnimationFrame(update);
        }
        update(0);
      }());
      break;
    case 2:
      const program1 = renderer.compileSync(fragment1, vertex);
      renderer.useProgram(program1);
      // 写数据
      bufferData();
      renderer.uniforms.stage = 0;
      renderer.render();
      const fbo0 = renderer.createFBO();
      renderer.bindFBO(fbo0); // 输出到FBO
      renderer.render();
      // 初始化
      renderer.bindFBO(null);
      renderer.uniforms.stage = 1;
      renderer.render();

      const handleMouseMove = e => {
        const {offsetX: x, offsetY: y} = e;
        const {width, height} = glRef.value.getBoundingClientRect();
        const glX = x / width, glY = 1 - y / height;
        renderer.uniforms.u_mouse = [glX, glY];
        renderer.uniforms.stage = 2;
        renderer.uniforms.tSource = fbo0.texture;
        renderer.render();
      };

      const addEvent = () => {
        renderer.bindFBO(null);
        glRef.value.addEventListener('mousemove', handleMouseMove)
      }
      addEvent();
      break;
  }
}

const customFBO = () => {
  return {
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
}

const bufferData = () => {
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
}
</script>

<style scoped>
.filter-type {
  display: inline-block;
  padding: 4px 10px;
  background-color: #646cff;
  color: #fff;
  cursor: pointer;
}
.filter-type.active {
  background-color: #4b52fc;
}
.filter-type + .filter-type {
  margin-left: 5px;
}
</style>
