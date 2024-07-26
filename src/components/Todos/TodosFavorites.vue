<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import { collection, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useTodoStore } from "../../stores/use-todo";
import EmptyBanner from "../EmptyBanner.vue";
import FooterComp from "../FooterComp.vue";


const showTodoList = ref(false);

const todoStore = useTodoStore();
const collectionRef = collection(db, "todos")
const todoSortedRef = query(collectionRef, orderBy("debut", "desc"));

onBeforeMount(async () => {
  todoStore.loadTodos(todoSortedRef);
});

onMounted(() => {
  showTodoList.value = true;
});

const setFavorites = (id, isFav) => {
  todoStore.addTodoFavorites(id, collectionRef, isFav);
};

</script>

<template>
  <Teleport to="#app"></Teleport>
  <div class="favorites h-screen">
    <template v-if="!todoStore.todos || todoStore.todos.length < 1">
      <EmptyBanner></EmptyBanner>
    </template>
      <template v-if="showTodoList">
          <li class="favorites__list" :class="{ 'done': todo.etat=='done'}" v-for="todo in todoStore.favTodos" :key="todo.id">
            <input :disabled="!todo.enableInput" class="favorites__list__text" v-model="todo.content" @keyup.enter="editTodo(todo.id, todo.content, todo)">
            <div class="favorites__btn">
              <div @click="setFavorites(todo.id, todo.favorite)" class="favorites__btn__fav"><img class="icon"
                :src="todo.favorite ? 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' : 'https://cdn-icons-png.flaticon.com/512/1828/1828970.png'" alt="add to favorites"></div>   
            </div>
          </li>
      </template>
  </div>
  <FooterComp></FooterComp>
</template>

<style lang="scss" scoped>

.favorites {
  @apply w-[50%];
  @apply min-w-[350px] min-h-[50px];

  &__list {
    @apply flex items-center p-2 bg-white mb-3 rounded-md hover:scale-105 transition;
    @apply min-h-[50px] min-w-[300px];
    box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
  }

  &__list__text {
    @apply flex-1 overflow-hidden outline-none;
    background-color: rgba(240, 248, 255, 0);
  }

  &__btn {
    @apply flex ml-auto gap-2;
    @apply min-w-[60px];

    .icon {
      @apply w-[25px] cursor-pointer hover:scale-110;
    }
  }

  .done {
    @apply text-gray-400 line-through bg-green-300;
  }

}
</style>