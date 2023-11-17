<template>
  <main-title title="WebGL入门基础"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
  { path: '/webgl-basis/triangle', name: '三角形' },
  { path: '/webgl-basis/polygon', name: '多边形' }
];
</script>

<style lang="less" scoped>

</style>
