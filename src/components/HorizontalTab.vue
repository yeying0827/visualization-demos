<template>
  <menu class="horizontal-tab">
    <li v-for="menu in menus">
      <router-link active-class="active" :to="menu.path" v-if="menu.path">{{ menu.name }}</router-link>
      <template v-else>{{ menu.name }}</template>
    </li>
  </menu>
</template>

<script setup>
defineProps({
  menus: {
    type: Array,
    required: true,
    default: function () {
      return [];
    }
  }
});
</script>

<style lang="less" scoped>
.horizontal-tab {
  display: flex;

  li {
    padding: 4px 10px;
    background: #fcdade;
    color: #555;
    cursor: pointer;

    & + li {
      margin-left: 10px;
    }
  }

  .active {
    color: yellow;
  }
}
</style>
