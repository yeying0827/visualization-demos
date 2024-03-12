<template>
  <main-title title="图案生成"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
  { path: '/pattern/css', name: 'CSS设置网格背景' },
  { path: '/pattern/webgl', name: 'WebGL设置重复图案' },
  { path: '/pattern/fractal', name: 'WebGL设置分形图案' },
  { path: '/pattern/random', name: 'WebGL设置随机图案' },
  { path: '/pattern/practice', name: '课后练习' },
];
</script>
