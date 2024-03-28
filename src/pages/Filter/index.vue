<template>
  <main-title title="滤镜函数"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
  { path: '/filter/gray', name: '灰度化图片' },
  { path: '/filter/filters', name: '滤镜函数使用' },
  { path: '/filter/gaussian-blur', name: '高斯模糊' },
  { path: '/filter/mix', name: '叠加使用' },
  { path: '/filter/css', name: 'CSS滤镜' },
  { path: '/filter/canvas', name: 'Canvas滤镜' },
  { path: '/filter/practice', name: '课后练习' },
];
</script>

<style lang="less" scoped>

</style>
