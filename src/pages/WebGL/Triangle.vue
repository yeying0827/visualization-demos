<template>
  <h3>使用WebGL绘制三角形</h3>
  <canvas height="512" width="512"></canvas>
</template>

<script setup>
import {onMounted} from "vue";

onMounted(() => {
  // 创建WebGL上下文
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl');

  // 创建WebGL程序
  // 1. 编写着色器
  const vertex = `
    attribute vec2 position;
    varying vec3 color;

    void main() {
      gl_PointSize = 1.0;
      color = vec3(0.5 + position * 0.5, 0.0);
      gl_Position = vec4(position, 1.0, 1.0);
    }
  `;
  const fragment = `
    precision mediump float;
    varying vec3 color;

    void main() {
      // gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
      gl_FragColor = vec4(color, 1.0);
    }
  `;
  // 2. 创建shader对象
  const vertexShader = gl.createShader(gl.VERTEX_SHADER); // 创建shader对象
  gl.shaderSource(vertexShader, vertex); // 把着色器代码传给shader对象
  gl.compileShader(vertexShader); // 编译shader对象

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragment);
  gl.compileShader(fragmentShader);
  // 3. 创建program对象并链接到WebGL上下文对象上
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader); // 将shader关联到WebGL program对象上
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  // 4. 启用program对象
  // 启用之后，当绘制图形时，GPU就会执行设定的两个shader程序了
  gl.useProgram(program);

  // 将数据存入缓冲区
  // 1. 定义三角形的三个顶点
  // 定义三角形顶点的过程，就是使用三角形顶点数据数组new一个Float32Array对象
  const points  = new Float32Array([
    -1, -1,
    0, 1,
    1, -1,
  ]);
  // 2. 将定义好的数据写入WebGL缓冲区
  const bufferId = gl.createBuffer(); // 创建buffer对象
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId); // 将buffer对象绑定为当前操作对象
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW); // 把当前数据写入缓存对象

  // 将缓冲区数据读取到GPU
  // 将buffer数据绑定给顶点着色器的position变量
  const vPosition = gl.getAttribLocation(program, 'position'); // 获取顶点着色器中position变量的地址
  // 创建一个指向调用gl.bindBuffer()指定的缓冲区的指针，并把它保存在vPosition中，在后面由顶点着色器使用
  // 每两个点代表一个顶点信息
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); // 给变量设置长度和类型
  gl.enableVertexAttribArray(vPosition); // 激活变量

  // 执行着色器程序完成绘制
  // WebGL会将对应的buffer数组传给顶点着色器，并开始绘制
  gl.clear(gl.COLOR_BUFFER_BIT); // 将当前画布的内容清除
  // gl.drawArrays(gl.TRIANGLES, 0, points.length / 2); // 以三角形为图元绘制，顶点偏移量和顶点数量

  gl.drawArrays(gl.LINE_LOOP, 0, points.length / 2);
});
</script>

<style scoped>
canvas {
  width: 256px;
  height: 256px;
}
</style>
