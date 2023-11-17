<template>
  <main-title title="声明式绘图系统"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
  { path: '/statement/shape', name: '几何图形' },
  { path: '/statement/hierarchy', name: '层次关系图' }
];
</script>

<style lang="less" scoped>

</style>
