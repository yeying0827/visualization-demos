<template>
  <main-title title="用着色器实现像素动画"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
  { path: '/animation-shader/fixed-frame', name: '固定帧动画' },
  { path: '/animation-shader/non-fixed-frame', name: '非固定帧动画' },
  { path: '/animation-shader/easing', name: '缓动函数' },
  { path: '/animation-shader/grain', name: '粒子动画' },
  { path: '/animation-shader/practice', name: '课后练习' },
];
</script>
