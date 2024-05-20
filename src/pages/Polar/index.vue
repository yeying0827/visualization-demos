<template>
  <main-title title="用极坐标系绘制有趣图案"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
  { path: '/polar/canvas', name: 'Canvas Demo' },
  { path: '/polar/webgl', name: 'webGL Demo' },
  { path: '/polar/conic-gradients', name: 'Conic Gradients' },
  { path: '/polar/color-wheel', name: 'Color Wheel' },
  { path: '/polar/practice', name: 'Practice' },
];
</script>
