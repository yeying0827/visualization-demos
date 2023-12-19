<template>
  <main-title title="颜色表示"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
  { path: '/color/rgb', name: 'RGB和RGBA' },
  { path: '/color/hsl', name: 'HSL和HSV' },
  { path: '/color/cie', name: 'CIE Lab和CIE Lch' },
  { path: '/color/cubehelix', name: 'Cubehelix色盘' },
  { path: '/color/webgl', name: 'WebGL demo' },
];
</script>

<style lang="less" scoped>

</style>
