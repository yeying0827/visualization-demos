<template>
  <h2>{{ title }}</h2>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
h2 {
  text-align: left;
}
</style>
