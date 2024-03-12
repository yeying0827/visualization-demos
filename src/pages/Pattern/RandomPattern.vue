<template>
  <h3>随机效果</h3>
  <div>
    <span
        class="pattern-type"
        :class="{active: checkedTab === index}"
        @click="checkedTab = index"
        v-for="(item, index) in tabs">{{ item.name }}</span>
  </div>
  <canvas ref="canvasRef" id="random-pattern" width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import GlRenderer from "gl-renderer";

const tabs = [
  {name: "生成随机色块"},
  {name: "动态移动的长方块"},
  {name: "迷宫"},
];
const checkedTab = ref(2);
const canvasRef = ref(null);

const vertex = `
  attribute vec2 a_vertexPosition;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    gl_PointSize = 1.0;
    vUv = uv;
    gl_Position = vec4(a_vertexPosition, 1.0, 1.0);
  }
`;

const fragment = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;

  // 伪随机函数：取正弦函数偏后部的小数部分的值来模拟随机
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233)))
                  * 43758.5453123);
  }

  // 最终得到当前像素点所要渲染的色值
  void main() {
    // 效果：一片噪点
    // gl_FragColor.rgb = vec3(random(vUv));

    // 效果：生成随机的色块
    // vUv * 10.0：纹理坐标相当于一个单元的坐标，坐标的范围是一个正方形
    // 所以*10.0相当于把纹理坐标在画布上的横向和纵向分别放大10倍，然后可以得到当前所要处理的像素在其中对应的坐标
    // 后续利用这个对应的坐标去计算色值
    vec2 st = vUv * 10.0;
    gl_FragColor.rgb = vec3(random(floor(st)));

    gl_FragColor.a = 1.0;
  }
`;

// 结合随机和动态效果：传入一个代表时间的uTime变量
const fragment1 = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vUv;

  uniform float uTime;

  // 伪随机函数：取正弦函数偏后部的小数部分的值来模拟随机
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233)))
                  * 43758.5453123);
  }

  void main() {
    // 效果：动态移动的长方块
    vec2 st = vUv * vec2(100.0, 50.0); // 100列（X轴分100份），50行（Y轴分50份）
    // st.x原始范围：0,100
    // st.y原始范围：0,50

    // floor(st.y)：0-1，1-2，,2-3，,3-4，4-5...49-50每一纵段
    // 重新计算st.x的值
    st.x -= (1.0 + 10.0 * random(vec2(floor(st.y)))) * uTime;

    vec2 ipos = floor(st); // integer
    vec2 fpos = fract(st); // fraction

    vec3 color = vec3(step(random(ipos), 0.7)); // 1,1,1 或 0,0,0
    color *= step(0.2, fpos.y); // y小数部分小于0.2时，step结果为0，color乘以0，则为黑色，黑色作为分割线

    gl_FragColor.rgb = color;
    gl_FragColor.a = 1.0;
  }
`;

// 使用 smoothstep 函数生成可以随机旋转方向的线段，从而生成一个迷宫
const fragment2 = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  #define PI 3.14159265358979323846

  varying vec2 vUv;
  uniform int rows;

  // 伪随机数
  float random (in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898, 78.233)))
                  * 43758.5453123);
  }

  // _index范围：(-1, 1)
  vec2 truchetPattern(in vec2 _st, in float _index) {
    _index = fract((_index - 0.5) * 2.0); // (_index - 0.5) * 2.0 范围：(-3.0, 1.0)
    if (_index > 0.75) {
      _st = vec2(1.0) - _st; // 类似于取补码
    } else if (_index > 0.5) {
      _st = vec2(1.0 - _st.x, _st.y); // x取补码，y取原码
    } else if (_index > 0.25) {
      // https://www.jianshu.com/p/3d7605a02516
      // float/vec2/vec3/vec4  包含 1，2，3，4 个浮点型向量
      // 所以1.0可以表示包含一个浮点数的向量？？
      _st = 1.0 - vec2(1.0 - _st.x, _st.y);
    }
    return _st;
  }

  void main() {
    // 效果：迷宫
    vec2 st = vUv * float(rows);
    vec2 ipos = floor(st); // integer。x和y坐标的整数部分
    vec2 fpos = fract(st); // fraction

    // 每一个方块内部的random(ipos)都是一样的
    vec2 tile = truchetPattern(fpos, random(ipos));
    float color = 0.0;

    // float smoothstep(float edge0, float edge1, float x);
    // 参数说明：
    // - edge0：定义平滑区域的开始边缘。
    // - edge1：定义平滑区域的结束边缘。
    // - x：要测试的值。
    // 当\`x\`在\`edge0\`和\`edge1\`之间时，函数返回一个在0和1之间的平滑插值。
    // 如果\`x\`小于\`edge0\`，返回值是0；如果\`x\`大于\`edge1\`，返回值是1。
    // 这个函数通常用于在两个值之间创建一个平滑的过渡，例如在渲染中的纹理混合、颜色渐变或者边缘检测中。

    color = smoothstep(tile.x - 0.3, tile.x, tile.y) -
            smoothstep(tile.x, tile.x + 0.3, tile.y);

    gl_FragColor = vec4(vec3(color), 1.0);

    // vec2 st = vUv * float(rows);
    // vec2 ipos = floor(st); // integer
    // vec2 fpos = fract(st); // fraction
    // float d;
    // // 原理：基于两条直线方程，y=x 和 y=1-x，分别有50%的概率画出来
    // if (random(ipos) >= 0.5) {
    //     d = abs(fpos.y + fpos.x - 1.0);
    // } else {
    //     d = abs(fpos.y - fpos.x);
    // }
    // // smoothstep(-0.3, 0.0, d)：d < -0.3 ===> 0 ；   d > 0 ===> 1
    // // smoothstep(0.0, 0.3, d)：d < 0 ===> 0 ；   d > 0.3 ===> 1
    // // 又已知d是绝对值 d >= 0.0，所以smoothstep(-0.3, 0.0, d)=1
    // // 当d>0.3时，color为0,0,0黑色
    // // 当0<=d<0.3时，color在1,1,1和0,0,0之间过渡
    // float color = smoothstep(-0.3, 0.0, d) - smoothstep(0.0, 0.3, d);
    // gl_FragColor = vec4(vec3(color),1.0);
  }
`;

let renderer, program;

onMounted(() => {
  // 第一步：创建Renderer对象
  renderer = new GlRenderer(canvasRef.value);
  // 根据不同的片元着色器创建WebGL程序，并设置uniform变量
  customProgramAndDatas(checkedTab.value);
  // 写数据并渲染
  bufferDataAndRender();

  watch(checkedTab, () => {
    customProgramAndDatas(checkedTab.value);
    bufferDataAndRender();
  });
});
const customProgramAndDatas = type => {
  switch(type) {
    case 0:
      // 创建并启用WebGL程序
      program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);
      // 设置uniform变量
      // ...
      break;
    case 1:
      // 创建并启用WebGL程序
      program = renderer.compileSync(fragment1, vertex);
      renderer.useProgram(program);
      // 设置uniform变量
      renderer.uniforms.uTime = 0.0;
      // 动态设置
      requestAnimationFrame(function update(t) {
        renderer.uniforms.uTime = 4 * t / 1000;
        requestAnimationFrame(update);
      });
      break;
    case 2:
      // 创建并启用WebGL程序
      program = renderer.compileSync(fragment2, vertex);
      renderer.useProgram(program);
      // 设置uniform变量
      renderer.uniforms.rows = 20;
      break;
  }
}

const bufferDataAndRender = () => {
  // 将顶点数据写入缓冲区
  // !!切换着色器之后要重新绑定缓冲区。
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
}
</script>

<style scoped>
.pattern-type {
  display: inline-block;
  padding: 4px 10px;
  background-color: #646cff;
  color: #fff;
  cursor: pointer;
}
.pattern-type.active {
  background-color: #4b52fc;
}
.pattern-type + .pattern-type {
  margin-left: 5px;
}
/*============ for fragment1 ==========*/
/*#random-pattern {
  width: 512px;
  height: 256px;
}*/
</style>
