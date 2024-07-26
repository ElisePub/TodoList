<script setup>
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { collection, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useTodoStore } from "../../stores/use-todo";
import { useSoundStore } from "../../stores/use-sound"
import DeleteModal from "../DeleteModal.vue";
import FooterComp from "../FooterComp.vue";
import EmptyBanner from "../EmptyBanner.vue";

const showAlert = ref(false);
const showAlertID = ref(null);

const showToDoWithoutFilter = ref(false);
const showToDoWithFilter = ref(false);
const dateFilter = ref('');
const stateFilter = ref('');
const priorityFilter = ref('');

const todoStore = useTodoStore();
const collectionRef = collection(db, "todos");
const todoSortedRef = query(collectionRef, orderBy("debut", "desc")); // Default sorting

const soundStore = useSoundStore();

onBeforeMount(async () => {
  todoStore.loadTodos(todoSortedRef);
});

onMounted(() => {
  showToDoWithoutFilter.value = true;
});

const deleteModalOpen = (id) => {
  showAlertID.value = id;
  showAlert.value = true;
};

const alertHandler = (status) => {
  if (!status) return showAlert.value = false;
  todoStore.deleteTodoList("todos", showAlertID.value);
  soundStore.deleteSound();
  showAlertID.value = null;
  showAlert.value = false;
};

const setDone = (id, todo) => {
  todoStore.setTodoDone(id, collectionRef);
  return soundStore.doneSound();
};

const setOngoing = (id) => {
  todoStore.setTodoOngoing(id, collectionRef);
};

const setUnDone = (id) => {
  todoStore.setTodoUndone(id, collectionRef);
};

const setFavorites = (id, isFav) => {
  todoStore.addTodoFavorites(id, collectionRef, isFav);
};

const enableEditInput = (todo) => {
  // Enable edition only for the todo clicked
  todoStore.todos.forEach(t => t.enableInput = false);
  todo.enableInput = true;
};

const editTodo = (id, new_content, todo) => {
  todo.enableInput = false;
  todoStore.editTodo(id, collectionRef, new_content);
};

const disableFilters = () => {
  showToDoWithoutFilter.value = true;
  showToDoWithFilter.value = false;
}

const enableFilters = () => {
  showToDoWithoutFilter.value = false;
  showToDoWithFilter.value = true;
}

watch([stateFilter, priorityFilter, dateFilter], async () => {
    enableFilters();
    var sortedQuery = todoSortedRef;
    if (dateFilter.value === "coming") {
      sortedQuery = query(collectionRef, orderBy("debut", "asc"));
    } else if (dateFilter.value === "ending"){
      sortedQuery = query(collectionRef, orderBy("fin", "asc"));
    }
    await todoStore.loadFilteredTodos(sortedQuery, priorityFilter.value, stateFilter.value);
});

</script>

<template>
  <Teleport to="#app">
    <template v-if="showAlert">
      <DeleteModal @setStatus="alertHandler"></DeleteModal>
    </template>
  </Teleport>

  <!-- filters !-->
  <div class="todos flex mb-4 items-center filters">
    <form class="filter max-w-sm mx-auto">
      <select v-model="stateFilter" class="text-center text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
        <option value="">State</option>
        <option value="to do">To Do</option>
        <option value="ongoing">Ongoing</option>
        <option value="done">Done</option>
      </select>
    </form>
    <form class="filter max-w-sm mx-auto">
      <select v-model="priorityFilter" class="text-center text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
        <option value="">Priority</option>
        <option value="higher">High</option>
        <option value="medium">Medium</option>
        <option value="lower">Low</option>
      </select>
    </form>
    <form class="filter max-w-sm mx-auto">
      <select v-model="dateFilter" class="text-center text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
        <option value="">Date</option>
        <option value="coming">Coming sooner</option>
        <option value="ending">Ending sooner</option>
      </select>
    </form>
    
    <button
      class="filters__button"
      @click="disableFilters"
      >
      <img class="filters__icon"
        src="https://cdn-icons-png.flaticon.com/512/3489/3489213.png"
        alt="delete filters">
    </button>
  </div>

  <div class="todos">
    <template v-if="(!todoStore.todos || todoStore.todos.length < 1) && showToDoWithoutFilter">
      <EmptyBanner></EmptyBanner>
    </template>

    <!-- not started todos !-->
    <template v-if="showToDoWithoutFilter">
      <TransitionGroup tag="ul" name="list" class="transition-group-style" appear>
        <li class="todos__list" :class="{ 'brightness-90': !todo.enableInput }" v-for="todo in todoStore.todos" :key="todo.id">
          <input :disabled="!todo.enableInput" class="todos__list__text" v-model="todo.content" @keyup.enter="editTodo(todo.id, todo.content, todo)">
          <div class="todos__btn">
            <div @click="enableEditInput(todo)" class="todos__btn__edit"><img class="icon"
                src="https://cdn-icons-png.flaticon.com/512/4476/4476194.png" alt="edit"></div>
            <div @click="setOngoing(todo.id)" class="todos__btn__ongoing"><img class="icon"
                src="https://cdn-icons-png.flaticon.com/512/10109/10109952.png" alt="mark as ongoing"></div>
            <div @click="deleteModalOpen(todo.id)" class="todos__btn__delete"><img class="icon"
                src="https://cdn-icons-png.flaticon.com/512/5028/5028066.png" alt="delete"></div>
            <div @click="setFavorites(todo.id, todo.favorite)" class="todos__btn__fav"><img class="icon"
              :src="todo.favorite ? 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' : 'https://cdn-icons-png.flaticon.com/512/1828/1828970.png'" alt="add to favorites"></div>   
          </div>
        </li>
      </TransitionGroup>

      <div class="z-10">
        <img src="/photos/hr.png" class="h-10 w-full" alt="">
      </div>

      <!-- ongoing todos !-->
      <h1 class="text-center customfont mb-4">Started</h1>
      <TransitionGroup tag="ul" name="list" class="transition-group-style" appear>
        <li class="todos__list" :class="{ 'done': todo.etat=='done', 'brightness-90': !todo.enableInput}" v-for="todo in todoStore.ongoingTodos" :key="todo.id">
          <input :disabled="!todo.enableInput" class="todos__list__text" v-model="todo.content" @keyup.enter="editTodo(todo.id, todo.content, todo)">
          <div class="todos__btn">
            <div @click="enableEditInput(todo)" class="todos__btn__delete"><img class="icon"
                src="https://cdn-icons-png.flaticon.com/512/4476/4476194.png" alt=""></div>
            <div @click="setDone(todo.id)" class="todos__btn__done"><img class="icon"
                src="https://cdn-icons-png.flaticon.com/512/4315/4315445.png" alt=""></div>
            <div @click="deleteModalOpen(todo.id)" class="todos__btn__delete"><img class="icon"
                src="https://cdn-icons-png.flaticon.com/512/5028/5028066.png" alt=""></div>
            <div @click="setFavorites(todo.id, todo.favorite)" class="todos__btn__fav"><img class="icon"
              :src="todo.favorite ? 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' : 'https://cdn-icons-png.flaticon.com/512/1828/1828970.png'" alt="add to favorites"></div> 
          </div>
        </li>
      </TransitionGroup>

      <div class="z-10">
          <img src="/photos/hr.png" class="h-10 w-full" alt="">
      </div>

      <!-- done todos !-->
      <h1 class="text-center customfont mb-4">Finished</h1>
      <TransitionGroup tag="ul" name="list" class="transition-group-style" appear>
        <li class="todos__list" :class="{ 'done': todo.etat=='done'}" v-for="todo in todoStore.doneTodos" :key="todo.id">
          <input class="todos__list__text" v-model="todo.content" @keyup.enter="editTodo(todo.id, todo.content)">
          <div class="todos__btn">
            <div @click="setUnDone(todo.id)" class="todos__btn__done"><img class="icon"
                src="https://cdn-icons-png.flaticon.com/512/11044/11044505.png" alt="set undone"></div>  
            <div @click="deleteModalOpen(todo.id)" class="todos__btn__delete"><img class="icon"
                src="https://cdn-icons-png.flaticon.com/512/5028/5028066.png" alt="delete"></div>
            <div @click="setFavorites(todo.id, todo.favorite)" class="todos__btn__fav"><img class="icon"
              :src="todo.favorite ? 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' : 'https://cdn-icons-png.flaticon.com/512/1828/1828970.png'" alt="add to favorites"></div> 
          </div>
        </li>
      </TransitionGroup>
    </template>


    <!-- template displayed if filters are applied !-->
    <template v-if="showToDoWithFilter">
      <TransitionGroup tag="ul" name="list" class="transition-group-style" appear>
        <li class="todos__list" :class="{ 'brightness-90': !todo.enableInput, 'done': todo.etat=='done', 'ongoing': todo.etat=='ongoing' }" v-for="todo in todoStore.filteredTodos" :key="todo.id">
          <input :disabled="!todo.enableInput" class="todos__list__text" v-model="todo.content" @keyup.enter="editTodo(todo.id, todo.content, todo)">
          <div class="todos__btn">
            <div @click="enableEditInput(todo)" class="todos__btn__edit"><img class="icon"
                src="https://cdn-icons-png.flaticon.com/512/4476/4476194.png" alt="edit"></div>
            <div @click="setOngoing(todo.id)" class="todos__btn__ongoing"><img class="icon"
                src="https://cdn-icons-png.flaticon.com/512/10109/10109952.png" alt="mark as ongoing"></div>
            <div @click="deleteModalOpen(todo.id)" class="todos__btn__delete"><img class="icon"
                src="https://cdn-icons-png.flaticon.com/512/5028/5028066.png" alt="delete"></div>
            <div @click="setFavorites(todo.id, todo.favorite)" class="todos__btn__fav"><img class="icon"
              :src="todo.favorite ? 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' : 'https://cdn-icons-png.flaticon.com/512/1828/1828970.png'" alt="add to favorites"></div>   
          </div>
        </li>
      </TransitionGroup>
    </template>
  </div>
  <FooterComp></FooterComp>
</template>

<style lang="scss" scoped>
.todos {
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
    @apply text-gray-500 line-through bg-green-300;
  }
}

.filters{
  .filter{
    @apply flex justify-center items-center ml-4 w-[80%] bg-white h-10 rounded-lg z-[0];
    @apply max-w-[600px]; 
  }

  &__button{
    @apply flex justify-center items-center w-[80%] bg-white h-10 rounded-lg z-[0] ml-2;
    @apply max-w-[3rem];
  }

  &__icon{
    @apply w-5 ;
    @apply hover:scale-110;
  }
}

</style>