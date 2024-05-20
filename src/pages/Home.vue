<template>
  <h2>可视化 demo展示</h2>
  <section class="container">
    <aside class="menu-box">
      <menu>
        <li v-for="menu in menus">
          <router-link :to="menu.path" active-class="nav-active">{{ menu.name }}</router-link>
        </li>
      </menu>
    </aside>
    <main class="show-box">
      <router-view></router-view>
    </main>
  </section>
</template>

<script setup>
import {onMounted} from "vue";

onMounted(() => {
  //
});

const menus = [
  { path: '/polar', name: '极坐标绘制图案' },
  { path: '/fragment-shape', name: '片元着色器-几何造型' },
  { path: '/texture-and-complex-filter', name: '纹理和其他复杂滤镜' },
  { path: '/filter', name: '滤镜函数' },
  { path: '/pattern', name: '图案生成' },
  { path: '/color', name: '颜色表示' },
  { path: '/transform', name: '仿射变换' },
  { path: '/polygon', name: '处理多边形' },
  { path: '/curve', name: '描述曲线' },
  { path: '/vector', name: '向量的乘法' },
  { path: '/axis', name: '使用向量和坐标系' },
  { path: '/webgl-basis', name: 'WebGL入门基础' },
  { path: '/statement', name: '声明式绘图系统' },
  { path: '/directive', name: '指令式绘图系统' },
  { path: '/compare', name: '常见绘图系统' },
];
</script>

<style lang="less">
.container {
  display: flex;
}

.menu-box {
  width: 300px;
  flex-shrink: 0;

  li {
    margin: 0 20px;

    & + li {
      margin-top: 3px;
    }

    a {
      display: block;
      padding: 10px;
      border-radius: 4px;
      background: #33cc77;
      color: #fff;

      &.nav-active {
        background: #4aa472;
      }
    }
  }
}

.show-box {
  position: relative;
  width: calc(100vw - 300px);
}
</style>
