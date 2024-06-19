<template>
  <main-title title="生成简单动画"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
  { path: '/animation/three-ways', name: '动画的三种形式' },
  { path: '/animation/model', name: '标准动画模型' },
  { path: '/animation/easing', name: '插值与缓动函数' },
  { path: '/animation/practice', name: '课后练习' },
];
</script>
