<script setup>
import { ref } from "vue";
import TodosAdd from '../components/Todos/TodosAdd.vue';
import TodosHome from '../components/Todos/TodosHome.vue';
import { useTodoStore } from '../stores/use-todo';

const todoStore = useTodoStore();
const filters = ref({ state: "", priority: "", date: "" });

const todoHandler = ({ content, start, end, priority }) => {
  todoStore.addTodoList("todos", { content, start, end, priority });
}

const updateFilters = (newFilters) => {
  filters.value = newFilters;
}

</script>

<template>
  <div class="wrapper">
    <h1 class="customfont text-secondary">My Todos</h1>
    <TodosAdd @todo="todoHandler"></TodosAdd>
    <TodosHome :filters="filters"></TodosHome>
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