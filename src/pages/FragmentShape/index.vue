<template>
  <main-title title="使用片元着色器进行几何造型"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
  { path: '/fragment-shape/color-control', name: '控制局部颜色' },
  { path: '/fragment-shape/circle', name: '绘制圆' },
  { path: '/fragment-shape/line', name: '绘制线' },
  { path: '/fragment-shape/triangle', name: '绘制三角形' },
  { path: '/fragment-shape/sdf', name: '符号距离场' },
  { path: '/fragment-shape/usage', name: '实际用途' },
  { path: '/fragment-shape/practice', name: '课后练习' },
];
</script>
