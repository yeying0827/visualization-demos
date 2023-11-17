<template>
  <main-title title="用向量和坐标系描述点和线段"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
  { path: '/axis/basis', name: '基础使用' },
  { path: '/axis/transform', name: '坐标系转换' },
  { path: '/axis/tree', name: '使用向量画一棵树' }
];
</script>

<style lang="less" scoped>

</style>
