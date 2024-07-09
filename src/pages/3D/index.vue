<template>
  <main-title title="用WebGL绘制3D物体"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
  { path: '/3d/cube', name: '三维立方体' },
  { path: '/3d/normal', name: '构造和使用法向量' },
  { path: '/3d/practice', name: '课后练习' },
];
</script>
