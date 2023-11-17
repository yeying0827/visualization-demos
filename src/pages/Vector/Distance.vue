<template>
  <h3>点到线段和直线的距离</h3>
  <canvas width="512" height="512"></canvas>
</template>

<script setup>
import Vector2D from "../../utils/vector2d.js";
import {onMounted} from "vue";

onMounted(() => {
  let v0, v1, v2;
  let map = new Map();
  let canvas = document.querySelector('canvas'),
      ctx = canvas.getContext('2d');
  translateCoordinate(); // 变换坐标系
  initPoints(); // 初始化三个点
  draw(); // 绘图
  initEvents(); // 事件初始化


  function translateCoordinate() {
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(1, -1);
  }

  function initPoints() {
    v0 = new Vector2D(0, 0);
    v1 = new Vector2D(100, 0);
    v2 = new Vector2D(-100, 0);
    map.set('P', v0);
    map.set('Q', v1);
    map.set('R', v2);
  }

  function draw() {
    drawAxis();

    for(const p of map) {
      drawPoint(p[1], p[0]);
    }

    drawBaseline();
    drawLines();
  }

  function drawAxis() {
    drawLine([-canvas.width / 2, 0], [canvas.width / 2, 0], "#333");
    drawLine([0, canvas.height / 2], [0, -canvas.height / 2], "#333");
  }

  function drawBaseline() {
    drawLine(map.get('Q'), map.get('R'), "blue");
  }

  // 绘制坐标点
  function drawPoint(v, name, color='#333') {
    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = color;
    ctx.arc(v.x, v.y, 2, 0, Math.PI * 2);
    ctx.scale(1, -1);
    ctx.fillText(`${name}`, v.x, 16 - v.y);
    ctx.restore();
    ctx.fill();
  }

  // 绘制线段
  function drawLines() {
    let QP = map.get('P').minus(map.get('Q'));
    let QR = map.get('R').minus(map.get('Q'));
    let RP = map.get('P').minus(map.get('R'));
    let result = QP.dot(QR);
    let d, dLine; // distance

    let crossProduct = QP.cross(QR);
    dLine = Math.abs(crossProduct) / QR.len;
    let n = getN2(); // getN(dLine);
    map.set('N', n);
    if (result < 0) {
      // 角PQR为钝角
      drawLine(map.get('Q'), map.get('P'), 'red');
      drawLine(map.get('P'), n, 'green');
      d = QP.len;
    } else if (result > Math.pow(QR.len, 2)) {
      // 角PRQ为钝角
      drawLine(map.get('R'), map.get('P'), 'red');
      drawLine(map.get('P'), n, 'green');
      d = RP.len;
    } else {
      d = dLine;
      drawLine(map.get('P'), n, 'red');
    }

    let text = `点P到线段QR的距离：${Math.floor(d)}, 点P到QR所在直线的距离为${Math.floor(dLine)}`;
    drawText(text);
  }

  function drawLine(start, end, color) {
    ctx.beginPath();
    ctx.save();
    ctx.lineWidth = '4px';
    ctx.strokeStyle = color;
    ctx.moveTo(...start);
    ctx.lineTo(...end);
    ctx.stroke();
    ctx.restore();
    ctx.closePath();
  }

  function getN2() {
    let QP = map.get('P').minus(map.get('Q'));
    let QR = map.get('R').minus(map.get('Q'));
    let Q = map.get('Q');
    // 已知：QN为QP在QR上的投影
    // QN = (QR / |QR|) * (QP·QR / |QR|)
    //    = QR * (QP·QR / |QR|²)
    // N.x - Q.x = QN.x, N.y - Q.y = QN.y
    let QN = QR.scale(QP.dot(QR) / QR.len**2);
    let N = new Vector2D(
        QN.x + Q.x,
        QN.y + Q.y
    );
    return N;
  }

  function drawText(distance) {
    ctx.beginPath();
    ctx.save();
    ctx.font = "16px serif";
    ctx.scale(1, -1);
    ctx.fillText(`${distance}`, -250, 240);
    ctx.restore();
  }

  function initEvents() {
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
      // let x = e.pageX - canvas.width / 2;
      // let y = -(e.pageY - canvas.height / 2);
      let x = (e.clientX - rect.left) - canvas.width / 2,
          y = canvas.height / 2 -(e.clientY - rect.top);
      v0 = new Vector2D(x, y);
      map.set('P', v0);
      draw();
    });
  }

  // @Deprecated
  function getN(d) {
    let P = map.get('P'), Q = map.get('Q'), R = map.get('R');
    let QR = R.minus(Q);
    let x, y;

    // y = f(x) = kx + m
    let k = QR.y / QR.x;
    let m = R.y - k * R.x;
    let flag;
    if(P.y > k * P.x + m) { // P在QR直线上方
      // Q在R的右边，则PN旋转到QR为顺时针，sin为正值
      // 否则，PN旋转到QR为逆时针，sin为负值
      flag = QR.x > 0 ? 1 : -1;
    } else { // P在QR直线下方
      // Q在R的右边，PN旋转到QR为逆时针，sin为负值
      // 否则，PN旋转到QR为顺时针，sin为正值
      flag = QR.x > 0 ? -1 : 1;
    }

    // 利用叉乘和点乘：PN与QR互相垂直
    // - 叉乘
    // PN x QR = |PN||QR| * ±1（即sin90°或sin-90°）
    // 此处|PN|的模为distance的值
    // (x - P.x) * QR.y - QR.x * (y - P.y) = ±1 * |PN|*|QR|
    // - 点乘
    // PN · QR = 0
    // (x - P.x) * QR.x + QR.y * (y - P.y) = 0;

    if(QR.x === 0) { // QR与Y轴平行或重合
      y = P.y;
      x = Q.x;
    } else if (QR.y === 0) { // QR与X轴平行或重合
      x = P.x;
      y = Q.y;
    } else {
      y = flag * (d * QR.len) / QR.y / (- QR.x / QR.y - QR.y / QR.x) + P.y;
      x = - (QR.y * (y - P.y) / QR.x) + P.x;
    }

    return new Vector2D(x, y);
  }
});
</script>

<style scoped>
body {
  margin: 0;
}

canvas {
  margin: 0;
  width: 512px;
  height: 512px;
  border: 1px solid #eee;
}
</style>
