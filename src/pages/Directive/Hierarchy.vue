<template>
  <h3>用Canvas+d3绘制层次关系图</h3>
  <canvas width="1600" height="1600"></canvas>
</template>

<script setup>
import * as d3 from 'd3-hierarchy';
import {onMounted} from "vue";

const TAU = 2 * Math.PI;

onMounted(() => {
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');

  const dataSource = 'https://s5.ssl.qhres2.com/static/b0695e2dd30daa64.json';
  let cities; // 所有城市数据
  let cCity = null; // 当前所在城市
  (async function() {
    // 从数据源获取JSON数据
    const data = await (await fetch(dataSource)).json();
    // 把数据转换成图形信息
    const regions = d3.hierarchy(data)
        .sum(d => 1)
        .sort((a, b) => b.value - a.value);

    const pack = d3.pack()
        .size([1600, 1600])
        .padding(3);

    const root = pack(regions);

    // 遍历数据并且根据数据内容绘制圆弧
    function draw(ctx, node, {fillStyle = 'rgba(0, 0, 0, 0.2)', textColor = 'white'} = {}) {
      const children  = node.children;
      const {x, y, r} = node;
      ctx.fillStyle = fillStyle;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
      if (children) {
        for (let i = 0; i < children.length; i ++) {
          draw(ctx, children[i]);
        }
      } else {
        const name = node.data.name;
        ctx.fillStyle = textColor;
        ctx.font = '1.5rem Arial';
        ctx.textAlign = 'center';
        ctx.fillText(name, x, y);
      }
    }

    draw(context, root);

    cities = root.children.map(x => x.children).flat(); // 收集城市坐标数据

    const rect = canvas.getBoundingClientRect();
    const left = rect.left,
        top = rect.top;
    canvas.addEventListener('mousemove', e => {
      // 计算偏移
      const offsetX = e.pageX - left,
          offsetY = e.pageY - top;
      checkInCircle(offsetX * 2, offsetY * 2);
    });
  }());

  function flatRegions(region) {
    if (region.children) {
      for (let i = 0; i < region.children.length; i ++) {
        flatRegions(region.children[i]);
      }
    } else {
      cities.push(region);
    }
  }

  CanvasRenderingContext2D.prototype.clearCircle = function (x, y, r) {
    context.save();
    context.fillStyle = "rgba(255, 255, 255, 255)";
    context.beginPath();
    context.arc(x, y, r, 0, TAU);
    context.fill();
    context.restore();
  }

  function checkInCircle(x, y) {
    const colors = ['rgba(0, 0, 0, 0.5)', 'rgba(255, 0, 0, 0.5)'];
    for (let i = 0; i < cities.length; i ++) {
      const {x: cx, y: cy, r: cr, data: {name}} = cities[i];
      const dx = x - cx,
          dy = y - cy,
          xmin = cx - cr,
          xmax = cx + cr,
          ymin = cy - cr,
          ymax = cy + cr;
      if ((x <= xmax && x >= xmin && y <= ymax && y >= ymin) && Math.pow(dx, 2) + Math.pow(dy, 2) < Math.pow(cr, 2)) {
        changeColor(cx, cy, cr, name, colors[1]);
      } else {
        changeColor(cx, cy, cr, name, colors[0]);
      }
    }
  }

  function changeColor(x, y, r, name, color) {
    context.clearCircle(x, y, r);
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, TAU);
    context.fill();
    context.fillStyle = "white";
    context.font = "1.5rem Arial";
    context.textAlign = "center";
    context.fillText(name, x, y);
  }
});
</script>

<style lang="less" scoped>
body {
  margin: 0;
}
canvas {
  width: 800px;
  height: 800px;
}
</style>
