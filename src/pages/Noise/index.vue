<template>
  <main-title title="使用噪声生成复杂的纹理"/>
  <horizontal-tab :menus="menus"/>
  <router-view></router-view>
</template>

<script setup>
import MainTitle from '../../components/MainTitle.vue';
import HorizontalTab from '../../components/HorizontalTab.vue';

const menus = [
  { path: '/noise/fold-line', name: '折线' },
  { path: '/noise/application', name: '噪声应用' },
  { path: '/noise/gradient', name: '梯度噪声' },
  { path: '/noise/clouds', name: '云雾效果' },
  { path: '/noise/simplex', name: 'Simplex Noise' },
  { path: '/noise/grid', name: '网格噪声' },
  { path: '/noise/practice', name: '课后练习' },
];
</script>
