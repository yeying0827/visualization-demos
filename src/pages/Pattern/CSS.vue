<template>
  <h3>CSS生成网格背景</h3>
  <div class="grid-bg"></div>
</template>

<style scoped>
.grid-bg {
  width: 300px;
  height: 300px;
  background-image: linear-gradient(to right, transparent 95%, #ccc 95%),
    linear-gradient(to bottom, transparent 95%, #ccc 0);
  //background-repeat: no-repeat;
  background-size: 8px 8px, 8px 8px;
}
</style>
