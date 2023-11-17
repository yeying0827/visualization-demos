<template>
  <main-title title="描述曲线"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
  { path: '/curve/vector', name: '使用向量' },
  { path: '/curve/param', name: '使用参数方程' },
  { path: '/curve/high-level', name: '高阶参数方程' },
  { path: '/curve/canvas', name: '使用Canvas指令绘制曲线' },
  { path: '/curve/svg', name: '使用Canvas指令绘制曲线' },
];
</script>

<style lang="less" scoped>

</style>
