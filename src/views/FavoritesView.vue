<script setup>
import TodosFavorites from '../components/Todos/TodosFavorites.vue';
</script>

<template>
  <div class="wrapper">
    <h1 class="customfont">Favorites</h1>
    <TodosFavorites></TodosFavorites>
  </div>

</template>

<style lang="scss" scoped>
.wrapper {
  @apply flex flex-col justify-center items-center gap-4;

  h1{
    @apply text-lg;
  }
}
</style>