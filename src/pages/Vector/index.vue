<template>
  <main-title title="向量的乘法"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
  { path: '/vector/basis', name: '基础使用' },
  { path: '/vector/distance', name: '应用：点到线段和直线的距离' }
];
</script>

<style lang="less" scoped>

</style>
