<script setup>
import { ref } from 'vue';
import AddTodoModal from '../AddTodoModal.vue';

const emits = defineEmits(["todo"]);
const addTodoModalOpen = ref(false);

const closeAddTodoModal = () => {
  addTodoModalOpen.value = false;
};

const openModal = () => {
  addTodoModalOpen.value = true;
};

const handleTodo = (todo) => {
  emits("todo", todo);
};

</script>

<template>
  <div class="addtodo">
    <template v-if="addTodoModalOpen">
      <AddTodoModal @close="closeAddTodoModal" @todo="handleTodo" :text="AddTodoModalText"></AddTodoModal>
    </template>
    <button
      class="addtodo__button"
      @click="openModal"
      >
      <img
      class="addtodo__icon"
      src="https://cdn-icons-png.flaticon.com/512/992/992651.png">
      </button>
  </div>
</template>

<style lang="scss" scoped>

.addtodo{
  @apply flex justify-center items-center w-[80%] bg-white h-10 rounded-lg z-[1];
  @apply max-w-[600px];

  &__input{
    @apply w-full ml-2 outline-none;
  }

  &__button{
    @apply flex justify-center items-center w-10 h-full;
  }

  &__icon{
    @apply w-5 ;
    @apply hover:scale-110;
  }

  
}

</style>