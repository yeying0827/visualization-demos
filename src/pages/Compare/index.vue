<template>
  <main-title title="常见绘图系统"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
    { path: '/compare/css', name: 'HTML+CSS' },
    { path: '/compare/svg', name: 'SVG' },
    { name: 'Canvas2D' },
    { name: 'WebGL'}
];
</script>

<style lang="less" scoped>

</style>
