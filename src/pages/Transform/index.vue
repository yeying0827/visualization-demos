<template>
  <main-title title="利用仿射变换对几何图形进行坐标变换"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
  { path: '/transform/grain-animation', name: '粒子动画' },
  { path: '/transform/css', name: 'CSS仿射变换' },
  { path: '/transform/css-3d', name: 'CSS仿射变换3D' },
];
</script>

<style lang="less" scoped>

</style>
