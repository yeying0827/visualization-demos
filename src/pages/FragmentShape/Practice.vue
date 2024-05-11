<template>
  <h3>课后练习</h3>
  <div>
    <span
        class="filter-type"
        :class="{active: checkedTab === index}"
        @click="checkedTab = index"
        v-for="(item, index) in tabs">{{ item.name }}</span>
  </div>
  <canvas ref="glRef" width="512" height="512"></canvas>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import GlRenderer from "gl-renderer";

const tabs = [
  {name: "正方形"},
  {name: "正六边形"},
  {name: "椭圆"},
  {name: "正方形环"},
  {name: "正六边形环"},
  {name: "椭圆环"},
  {name: "正六角星"},
  {name: "正六角星环"},
];

const checkedTab = ref(5);
const glRef = ref(null);

const distanceFunction = `
  // 点到直线的距离
  float line_distance(in vec2 st, in vec2 a, in vec2 b) {
    vec3 ab = vec3(b - a, 0);
    vec3 p = vec3(st - a, 0);
    float l = length(ab);
    return cross(p, normalize(ab)).z;
  }

  // 点到线段的距离
  float seg_distance(in vec2 st, in vec2 a, in vec2 b) {
    vec3 ab = vec3(b - a, 0);
    vec3 p = vec3(st - a, 0);
    float l = length(ab);
    float d = abs(cross(p, normalize(ab)).z);
    float proj = dot(p, ab) / l;
    if(proj >= 0.0 && proj <= l) return d;
    return min(distance(st, a), distance(st, b));
  }

  // 点到三角形的距离
  float triangle_distance(in vec2 st, in vec2 a, in vec2 b, in vec2 c) {
    float d1 = line_distance(st, a, b);
    float d2 = line_distance(st, b, c);
    float d3 = line_distance(st, c, a);

    if ((d1 >= 0.0 && d2 >= 0.0 && d3 >= 0.0)
        || (d1 <= 0.0 && d2 <= 0.0 && d3 <= 0.0)) {
      return -min(abs(d1), min(abs(d2), abs(d3))); // 内部距离为负
    }

    return min(seg_distance(st, a, b), min(seg_distance(st, b, c), seg_distance(st, c, a))); // 外部距离为正
  }
`;

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
// 正方形
const fragment = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${distanceFunction}

  float square_distance(in vec2 st, in vec2 a, in vec2 b, in vec2 c, in vec2 d) {
    float d1 = line_distance(st, a, b);
    float d2 = line_distance(st, b, c);
    float d3 = line_distance(st, c, d);
    float d4 = line_distance(st, d, a);

    if (d1 >= 0.0 && d2 >= 0.0 && d3 >= 0.0 && d4 >= 0.0
    || d1 <= 0.0 && d2 <= 0.0 && d3 <= 0.0 && d4 <= 0.0) {
      return -min(abs(d1), min(abs(d2), min(abs(d3), abs(d4))));
    }

    return min(seg_distance(st, a, b), min(seg_distance(st, b, c), min(seg_distance(st, c, d), seg_distance(st, d, a))));
  }

  void main() {
    float d = square_distance(
      vUv,
      vec2(0.3, 0.3),
      vec2(0.3, 0.7),
      vec2(0.7, 0.7),
      vec2(0.7, 0.3)
    );
    gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
// 正六边形
const fragment1 = `
  #define PI 3.1415926535897932384626433832795
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${distanceFunction}

  // 以向量方式计算
  float polygon_distance(in vec2 st, in int edges, in vec2 start, in float step) {
    // 正多边形内角和 = (n - 2) * 180°
    // 每个内角的角度 = (n - 2) * 180° / n
    // 每个角要旋转到下一个角的旋转角度 = 每个角的补角 = 180° - (n-2) / n * 180°
    float delta = PI * (1.0 - (float(edges) - 2.0) / float(edges));
    // float delta = 2 * PI / float(edges);
    mat2 rotation = mat2(
      cos(delta), sin(delta),
      -sin(delta), cos(delta)
    );

    // 赋初始值
    vec2 dir = vec2(step, 0.0);
    vec2 startPoint = vec2(start); // 起点
    dir = rotation * dir;
    vec2 endPoint = vec2(startPoint.x + dir.x, startPoint.y + dir.y); // 终点
    float minSeg = seg_distance(st, startPoint, endPoint); // 点到线段的距离
    float lineSign = sign(line_distance(st, startPoint, endPoint)); // 点到向量的距离的符号
    bool isInner = true;
    // 循环
    for(int i = 1; i < 32767; i ++) {
      if (i >= edges) break;
      startPoint = endPoint;
      dir = rotation * dir;
      endPoint = vec2(startPoint.x + dir.x, startPoint.y + dir.y);
      minSeg = min(minSeg, seg_distance(st, startPoint, endPoint)); // 点到两条线段的距离的较小值

      if (isInner && lineSign != sign(line_distance(st, startPoint, endPoint))) { // 两个叉乘结果符号不一致，说明在图形外部
        isInner = false;
      }
    }
    return isInner ? -minSeg : minSeg;
  }

  // 以极坐标方式计算
  float polygon_distance2(in vec2 st, in int edges, in vec2 start) {
    float delta = 2.0 * PI / float(edges);
    mat2 rotation = mat2(
      cos(delta), sin(delta),
      -sin(delta), cos(delta)
    );

    // 赋初始值
    vec2 startPoint = vec2(start); // 起点
    vec2 endPoint = rotation * startPoint; // 下一个点
    float minSeg = seg_distance(st, startPoint, endPoint); // 点到线段的距离
    float lineSign = sign(line_distance(st, startPoint, endPoint)); // 点到向量的距离的符号
    bool isInner = true;
    // 循环
    for(int i = 1; i < 32767; i ++) {
      if (i >= edges) break;
      startPoint = endPoint;
      endPoint = rotation * startPoint;
      minSeg = min(minSeg, seg_distance(st, startPoint, endPoint)); // 点到两条线段的距离的较小值

      if (isInner && lineSign != sign(line_distance(st, startPoint, endPoint))) { // 两个叉乘结果符号不一致，说明在图形外部
        isInner = false;
      }
    }
    return isInner ? -minSeg : minSeg;
  }

  void main() {
    // float d = polygon_distance(
    //   vUv,
    //   6,
    //   vec2(0.65, 0.25), // 起始点（右下角）
    //   0.3
    // );

    float d = polygon_distance2(
      vUv - vec2(0.5), // 以圆心坐标计算出的色值，给(0.5,0.5)坐标上色，相当于将图形向右上方挪动
      6,
      // vec2(0.13, 0.05)
      vec2(0.2, 0.0) // 起始点
    );

    gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
// 椭圆
const fragment2 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  float ellipse_distance(in vec2 st, in vec2 center, in float radiusX, in float radiusY) {
    float d = pow((vUv.x - center.x), 2.0) / pow(radiusX, 2.0) + pow((vUv.y - center.y), 2.0) / pow(radiusY, 2.0); // 椭圆公式
    if (d <= 1.0) return -d; // 如果在椭圆内部返回负数
    return d - 1.0;
  }

  void main() {
    float d = ellipse_distance(
      vUv,
      vec2(0.5, 0.5),
      0.4,
      0.2
    );
    gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.03, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
// 正方形环
const fragment3 = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${distanceFunction}

  float square_distance(in vec2 st, in vec2 a, in vec2 b, in vec2 c, in vec2 d) {
    float d1 = line_distance(st, a, b);
    float d2 = line_distance(st, b, c);
    float d3 = line_distance(st, c, d);
    float d4 = line_distance(st, d, a);

    if (d1 >= 0.0 && d2 >= 0.0 && d3 >= 0.0 && d4 >= 0.0
    || d1 <= 0.0 && d2 <= 0.0 && d3 <= 0.0 && d4 <= 0.0) {
      return -min(abs(d1), min(abs(d2), min(abs(d3), abs(d4))));
    }

    return min(seg_distance(st, a, b), min(seg_distance(st, b, c), min(seg_distance(st, c, d), seg_distance(st, d, a))));
  }

  void main() {
    float d = square_distance(
      vUv,
      vec2(0.3, 0.3),
      vec2(0.3, 0.7),
      vec2(0.7, 0.7),
      vec2(0.7, 0.3)
    );

    // d = fract(20.0 * abs(d));
    // gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
    // gl_FragColor.a = 1.0;

    // // d = fract(20.0 * abs(d)); // 内部距离近-远：黑->白(0->1)
    // d = fract(20.0 * d); // 内部距离近-远：白-> 黑(1->0)
    // gl_FragColor.rgb = vec3(d);
    // gl_FragColor.a = 1.0; // 1不透明

    gl_FragColor.rgb = vec3(0.0);
    gl_FragColor.a = 1.0 - fract(abs(d) * 64.0); // 内部距离近-远：(0->1) => 透明度：1->0(不透明->透明)
    // gl_FragColor.a = 1.0 - fract(d * 64.0); // 内部距离近-远：(1->0) => 透明度：0->1(透明->不透明)
  }
`;
// 正六边形环
const fragment4 = `
    #define PI 3.1415926535897932384626433832795
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${distanceFunction}

  // 以向量方式计算
  float polygon_distance(in vec2 st, in int edges, in vec2 start, in float step) {
    // 正多边形内角和 = (n - 2) * 180°
    // 每个内角的角度 = (n - 2) * 180° / n
    // 每个角要旋转到下一个角的旋转角度 = 每个角的补角 = 180° - (n-2) / n * 180°
    float delta = PI * (1.0 - (float(edges) - 2.0) / float(edges));
    // float delta = 2 * PI / float(edges);
    mat2 rotation = mat2(
      cos(delta), sin(delta),
      -sin(delta), cos(delta)
    );

    // 赋初始值
    vec2 dir = vec2(step, 0.0);
    vec2 startPoint = vec2(start); // 起点
    dir = rotation * dir;
    vec2 endPoint = vec2(startPoint.x + dir.x, startPoint.y + dir.y); // 终点
    float minSeg = seg_distance(st, startPoint, endPoint); // 点到线段的距离
    float lineSign = sign(line_distance(st, startPoint, endPoint)); // 点到向量的距离的符号
    bool isInner = true;
    // 循环
    for(int i = 1; i < 32767; i ++) {
      if (i >= edges) break;
      startPoint = endPoint;
      dir = rotation * dir;
      endPoint = vec2(startPoint.x + dir.x, startPoint.y + dir.y);
      minSeg = min(minSeg, seg_distance(st, startPoint, endPoint)); // 点到两条线段的距离的较小值

      if (isInner && lineSign != sign(line_distance(st, startPoint, endPoint))) { // 两个叉乘结果符号不一致，说明在图形外部
        isInner = false;
      }
    }
    return isInner ? -minSeg : minSeg;
  }

  // 以极坐标方式计算
  float polygon_distance2(in vec2 st, in int edges, in vec2 start) {
    float delta = 2.0 * PI / float(edges);
    mat2 rotation = mat2(
      cos(delta), sin(delta),
      -sin(delta), cos(delta)
    );

    // 赋初始值
    vec2 startPoint = vec2(start); // 起点
    vec2 endPoint = rotation * startPoint; // 下一个点
    float minSeg = seg_distance(st, startPoint, endPoint); // 点到线段的距离
    float lineSign = sign(line_distance(st, startPoint, endPoint)); // 点到向量的距离的符号
    bool isInner = true;
    // 循环
    for(int i = 1; i < 32767; i ++) {
      if (i >= edges) break;
      startPoint = endPoint;
      endPoint = rotation * startPoint;
      minSeg = min(minSeg, seg_distance(st, startPoint, endPoint)); // 点到两条线段的距离的较小值

      if (isInner && lineSign != sign(line_distance(st, startPoint, endPoint))) { // 两个叉乘结果符号不一致，说明在图形外部
        isInner = false;
      }
    }
    return isInner ? -minSeg : minSeg;
  }

  void main() {
    // float d = polygon_distance(
    //   vUv,
    //   6,
    //   vec2(0.65, 0.25), // 起始点（右下角）
    //   0.3
    // );

    float d = polygon_distance2(
      vUv - vec2(0.5), // 以圆心坐标计算出的色值，给(0.5,0.5)坐标上色，相当于将图形向右上方挪动
      6,
      // vec2(0.13, 0.05)
      vec2(0.2, 0.0) // 起始点
    );

    d = fract(20.0 * d);
    gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
// 椭圆环
const fragment5 = `
  #define PI 3.1415926535897932384626433832795
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;

  float ellipse_distance(in vec2 st, in vec2 center, in float radiusX, in float radiusY) {
    float d = pow((vUv.x - center.x), 2.0) / pow(radiusX, 2.0) + pow((vUv.y - center.y), 2.0) / pow(radiusY, 2.0); // 椭圆公式

    if (d <= 0.0) return d * (min(radiusX, radiusY) / max(radiusX, radiusY));
    return (d) * (1.0 - min(radiusX, radiusY) / max(radiusX, radiusY));
  }

  void main() {
    float d = ellipse_distance(
      vUv,
      vec2(0.5, 0.5),
      0.35,
      0.2
    );
    d = fract(20.0 * abs(d));
    // gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);

    gl_FragColor.rgb = vec3(d);

    // gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);

    gl_FragColor.a = 1.0;
  }
`;
// 正六角星
const fragment6 = `
  #define PI 3.1415926535897932384626433832795
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${distanceFunction}

  // 以极坐标方式计算，短边作为起始点
  float polygon_distance2(in vec2 st, in int edges, in vec2 start) {
    float delta = PI / float(edges);
    mat2 rotation = mat2(
      cos(delta), sin(delta),
      -sin(delta), cos(delta)
    );

    // 赋初始值
    // 偶数点短半径，奇数点长半径
    vec2 startPoint = vec2(start); // 第0个点
    vec2 midPoint = 2.0 * rotation * startPoint; // 第1个点
    vec2 endPoint = rotation * rotation * startPoint; // 第2个点

    float minSeg = min(seg_distance(st, startPoint, midPoint), seg_distance(st, midPoint, endPoint)); // 点到线段的距离
    float lineSign = sign(line_distance(st, startPoint, endPoint)); // 点到向量的距离的符号
    float triangleD = triangle_distance(st, startPoint, midPoint, endPoint);

    bool isInner = true;
    bool isInTriangle = false;
    int count = 2;
    // 循环
    for(int i = 2; i < 32767; i ++) {
      if (count > edges * 2) break;
      count = count + 2;

      float triangleD = triangle_distance(st, startPoint, midPoint, endPoint);
      if (triangleD <= 0.0) isInTriangle = true;

      startPoint = endPoint;
      midPoint = 2.0 * rotation * startPoint;
      endPoint = rotation * rotation * startPoint;

      minSeg = min(minSeg, min(seg_distance(st, startPoint, midPoint), seg_distance(st, midPoint, endPoint))); // 点到两条线段的距离的较小值

      if (isInner && lineSign != sign(line_distance(st, startPoint, endPoint))) { // 两个叉乘结果符号不一致，说明在图形外部
        isInner = false;
      }
    }
    return isInner || isInTriangle ? -minSeg : minSeg;
  }

  void main() {
    float d = polygon_distance2(
      vUv - vec2(0.5), // 以圆心坐标计算出的色值，给(0.5,0.5)坐标上色，相当于将图形向右上方挪动
      6,
      // vec2(0.13, 0.05)
      vec2(0.2, 0.0) // 起始点
    );

    gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.01, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
  }
`;
// 正六角星环
const fragment7 = `
  #define PI 3.1415926535897932384626433832795
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  uniform sampler2D tMap;
  uniform float uTime;

  ${distanceFunction}

  // 以极坐标方式计算，短边作为起始点
  float polygon_distance2(in vec2 st, in int edges, in vec2 start) {
    float delta = PI / float(edges);
    mat2 rotation = mat2(
      cos(delta), sin(delta),
      -sin(delta), cos(delta)
    );

    // 赋初始值
    // 偶数点短半径，奇数点长半径
    vec2 startPoint = vec2(start); // 第0个点
    vec2 midPoint = 2.0 * rotation * startPoint; // 第1个点
    vec2 endPoint = rotation * rotation * startPoint; // 第2个点

    float minSeg = min(seg_distance(st, startPoint, midPoint), seg_distance(st, midPoint, endPoint)); // 点到线段的距离
    float lineSign = sign(line_distance(st, startPoint, endPoint)); // 点到向量的距离的符号
    float triangleD = triangle_distance(st, startPoint, midPoint, endPoint);

    bool isInner = true;
    bool isInTriangle = false;
    int count = 2;
    // 循环
    for(int i = 2; i < 32767; i ++) {
      if (count > edges * 2) break;
      count = count + 2;

      float triangleD = triangle_distance(st, startPoint, midPoint, endPoint);
      if (triangleD <= 0.0) isInTriangle = true;

      startPoint = endPoint;
      midPoint = 2.0 * rotation * startPoint;
      endPoint = rotation * rotation * startPoint;


      minSeg = min(minSeg, min(seg_distance(st, startPoint, midPoint), seg_distance(st, midPoint, endPoint))); // 点到两条线段的距离的较小值

      if (isInner && lineSign != sign(line_distance(st, startPoint, endPoint))) { // 两个叉乘结果符号不一致，说明在图形外部
        isInner = false;
      }
    }
    return isInner || isInTriangle ? -minSeg : minSeg;
  }

  void main() {
    float d = polygon_distance2(
      vUv - vec2(0.5), // 以圆心坐标计算出的色值，给(0.5,0.5)坐标上色，相当于将图形向右上方挪动
      6,
      // vec2(0.13, 0.05)
      vec2(0.2, 0.0) // 起始点
    );

    d = fract(20.0 * abs(d));
    gl_FragColor.rgb = (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
    // gl_FragColor.rgb = vec3(d);
    gl_FragColor.a = 1.0;
  }
`;

let renderer, program;

onMounted(() => {
  drawByTab(checkedTab.value);
  // 写数据并渲染
  bufferDataAndRender();

  watch(checkedTab, () => {
    drawByTab(checkedTab.value);
    // 写数据并渲染
    bufferDataAndRender();
  });
});

const drawByTab = value => {
  switch (value) {
    case 0:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);
      break;
    case 1:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment1, vertex);
      renderer.useProgram(program);
      break;
    case 2:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment2, vertex);
      renderer.useProgram(program);
      break;
    case 3:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment3, vertex);
      renderer.useProgram(program);
      break;
    case 4:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment4, vertex);
      renderer.useProgram(program);
      break;
    case 5:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment5, vertex);
      renderer.useProgram(program);
      break;
    case 6:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment6, vertex);
      renderer.useProgram(program);
      break;
    case 7:
      renderer = new GlRenderer(glRef.value);
      program = renderer.compileSync(fragment7, vertex);
      renderer.useProgram(program);
      break;
  }
}

const bufferDataAndRender = () => {
  // 将顶点数据写入缓冲区
  // !!切换着色器之后要重新绑定缓冲区，否则会报vertex缓存空间不足
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
};

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
