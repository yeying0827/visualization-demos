<template>
  <main-title title="给图案添加纹理和复杂滤镜"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
  { path: '/texture-and-complex-filter/canvas', name: '其他简单滤镜' },
  { path: '/texture-and-complex-filter/webgl', name: 'WebGL纹理' },
  { path: '/texture-and-complex-filter/practice', name: '课后练习' },
];
</script>

<style lang="less" scoped>

</style>
