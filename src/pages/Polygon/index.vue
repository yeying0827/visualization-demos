<template>
  <main-title title="处理多边形"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
  { path: '/polygon/canvas2d-fill', name: 'Canvas2D填充多边形' },
  { path: '/polygon/canvas2d-check', name: 'Canvas2D判断边界' },
  { path: '/polygon/webgl-fill', name: 'WebGL填充多边形' },
  { path: '/polygon/webgl-check', name: 'WebGL判断边界' },
  { path: '/polygon/tess2-triangulation', name: 'TESS2三角剖分' },
];
</script>

<style lang="less" scoped>

</style>
