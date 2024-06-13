<template>
  <main-title title="使用后期处理通道增强图像效果"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
  { path: '/post-process-channel/blur', name: 'Blur滤镜' },
  { path: '/post-process-channel/tone', name: '辉光效果' },
  { path: '/post-process-channel/smoke', name: '烟雾效果' },
  { path: '/post-process-channel/practice', name: '课后练习' },
];
</script>
