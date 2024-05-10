<template>
  <canvas width="1024" height="1024"></canvas>
</template>

<script setup>
import {onMounted} from "vue";
import GlRenderer from 'gl-renderer';

onMounted(() => {
  const vertex = `
    attribute vec2 a_vertexPosition;
    attribute vec2 uv;
    varying vec2 vUv;

    uniform int scale; // 缩放比例
    uniform vec2 offset; // 平移的偏移量

    // 平移矩阵
    mat3 translateMatrix = mat3(
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      offset.x, offset.y, 1.0
    ); // (0,0)
    // 缩放矩阵
    mat3 scaleMatrix = mat3(
      float(scale), 0.0, 0.0,
      0.0, float(scale), 0.0,
      0.0, 0.0, 1.0
    );

    void main() {
      gl_PointSize = 1.0;
      vUv = uv;
      vec3 pos = scaleMatrix * translateMatrix * vec3(a_vertexPosition, 1.0);
      gl_Position = vec4(pos, 1.0);
    }
  `;
  const fragment = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec2 vUv;
    uniform float rows;

    void main() {
      // 针对某个像素点执行
      // vUv: 一个单元的坐标，坐标的范围：正方形
      // vUv * rows：待处理的像素点  映射 纹理坐标上的位置，映射的坐标 => 计算色值

      vec2 st = fract(vUv * rows); // 像素点对应纹理坐标的小数部分
      float d1 = step(st.x, 0.9);
      float d2 = step(0.1, st.y);
      // st.x <=0.9 && st.y >=0.1 ===> d1*d2=1

      // d1=0 || d2=0     <======>    st.x>0.9 || st.y < 0.1
      gl_FragColor.rgb = mix(vec3(0.8), vec3(1.0), d1 * d2);
      gl_FragColor.a = 1.0;
    }
  `;

  // 创建Renderer对象
  const canvas = document.querySelector('canvas');
  const renderer = new GlRenderer(canvas);
  // 创建WebGL程序
  const program = renderer.compileSync(fragment, vertex);
  renderer.useProgram(program);
  // 设置uniform
  renderer.uniforms.rows = 64;
  renderer.uniforms.scale = 1;
  renderer.uniforms.offset = [0.0, 0.0];
  // 把数据送入缓冲区
  renderer.setMeshData([{
    positions: [
        [-1, -1],
        [-1, 1],
        [1, 1],
        [1, -1]
    ],
    attributes: {
      uv: [ // 纹理坐标
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0]
      ]
    },
    cells: [ // 三角剖分
        [0, 1, 2],
        [2, 0, 3]
    ]
  }]);
  // 渲染
  renderer.render();


  const wheelEventHandler = e => {
    e.preventDefault();
    if (e.wheelDeltaY > 0) { // 放大
      if (renderer.uniforms.scale <= 50) {
        renderer.uniforms.scale += 1;
        renderer.render();
      }
    } else {
      if (renderer.uniforms.scale > 2) {
        renderer.uniforms.scale -= 1;
      }
    }
  };

  const lastPos = {}, lastCenter = {x: 0.0, y: 0.0};

  const mouseDownHandler = e => {
    e.preventDefault();
    // 记录初始位置
    lastPos.x = e.offsetX; // offsetX和offsetY可以理解为坐标原点为左上角，X轴向右，Y轴向下
    lastPos.y = e.offsetY;
    canvas.addEventListener('mousemove', mouseMoverHandler);
  }
  const mouseMoverHandler = e => {
    e.preventDefault();
    const {offsetX: x, offsetY: y} = e; // offsetX和offsetY可以理解为坐标原点为左上角，X轴向右，Y轴向下
    const translateX = (x - lastPos.x) / canvas.width;
    const translateY = (lastPos.y - y) / canvas.height; // 转换得到偏移量在WebGL中的对应数值
    renderer.uniforms.offset = [translateX + lastCenter.x, translateY + lastCenter.y];
  };
  const mouseUpHandler = e => {
    e.preventDefault();
    const {offsetX: x, offsetY: y} = e; // offsetX和offsetY可以理解为坐标原点为元素左上角，X轴向右，Y轴向下
    const translateX = (x - lastPos.x) / canvas.width;
    const translateY = (lastPos.y - y) / canvas.height; // 转换得到偏移量在WebGL中的对应数值
    // 更新中心点信息
    lastCenter.x = translateX + lastCenter.x;
    lastCenter.y = translateY + lastCenter.y;
    canvas.removeEventListener('mousemove', mouseMoverHandler);
  }

  const addEvent = () => {
    canvas.addEventListener('mousewheel', wheelEventHandler);
    canvas.addEventListener('mouseup', mouseUpHandler);
    canvas.addEventListener('mousedown', mouseDownHandler);
  }
  addEvent();
});

</script>
