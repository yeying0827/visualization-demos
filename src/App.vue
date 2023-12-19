<script setup>
import GitHub from './components/GitHub.vue';
</script>

<template>
  <div class="main-container">
    <a href="https://github.com/yeying0827/visualization-demos" target="_blank"><git-hub class="icon-github"></git-hub></a>
    <router-view></router-view>
  </div>
</template>

<style scoped>
.main-container {
  width: 100%;
}
.icon-github {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
