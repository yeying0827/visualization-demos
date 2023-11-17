<template>
  <h3>用SVG+d3绘制层次关系图</h3>
  <h1 id="city-name"></h1>
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1600 1600"></svg>
</template>

<script setup>
import {onMounted} from "vue";
import * as d3 from 'd3-hierarchy';

onMounted(() => {
  // 获取SVG对象
  const svgroot = document.querySelector('svg');

  const dataSource = 'https://s5.ssl.qhres2.com/static/b0695e2dd30daa64.json';

  (async function() {
    const data = await (await fetch(dataSource)).json();
    const regions = d3.hierarchy(data)
        .sum(d => 1)
        .sort((a, b) => b.value - a.value);
    const pack = d3.pack()
        .size([1600, 1600])
        .padding(3);
    const root = pack(regions);

    // 从root开始遍历数据对象
    draw(svgroot, root);

    // 监听鼠标悬浮，通过事件冒泡处理鼠标事件
    const titleEl = document.querySelector('#city-name');
    let activeTarget;
    svgroot.addEventListener('mousemove', e => {
      let target = e.target;
      titleEl.innerText = getTitle(target);
      if (target.nodeName === 'text') target = target./* parentNode. */previousSibling;
      if (activeTarget !== target) {
        if (activeTarget) activeTarget.setAttribute('fill', 'rgba(0, 0, 0, 0.2)')
      }
      target.setAttribute('fill', 'rgba(0, 128, 0, 0.1)');
      activeTarget = target;
    });
  }());
});

function draw(parent, node, {fillStyle = 'rgba(0, 0, 0, 0.2)', textColor = 'white'} = {}) {
  const children = node.children;
  const {x, y, r} = node;
  // 创建SVG元素，将元素添加到DOM文档里
  // 第一个参数是名字空间，对应SVG名字空间`http://www.w3.org/2000/svg`；第二个参数是要创建的元素的标签名
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', r);
  circle.setAttribute('fill', fillStyle);
  circle.setAttribute('data-name', node.data.name); // 设置扩展属性
  parent.appendChild(circle);

  if (children) {
    // g元素表示一个分组，可以用它来对SVG元素建立起层级结构
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('data-name', node.data.name); // 设置扩展属性
    for (let i = 0; i < children.length; i ++) {
      draw(group, children[i], {fillStyle, textColor});
    }
    parent.appendChild(group);
  } else {
    // 在SVG中添加文字，只需要创建text元素
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('fill', textColor);
    text.setAttribute('font-family', 'Arial');
    text.setAttribute('font-size', '1.5rem');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.setAttribute('data-name', node.data.name);
    const name = node.data.name;
    text.textContent = name;
    parent.appendChild(text);
  }
}

function getTitle(target) {
  const name = target.getAttribute('data-name');
  if (target.parentNode && target.parentNode.nodeName === 'g') {
    const parentName = target.parentNode.getAttribute('data-name');
    return `${parentName} - ${name}`;
  }
  return name;
}
</script>

<style scoped>
h1 {
  position: absolute;
  left: 0;
  width: 100%;
  text-align: center;
}

svg {
  width: 100%;
  height: 800px;
}
</style>
