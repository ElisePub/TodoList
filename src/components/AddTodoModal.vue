<script setup>
import ButtonComp from './ButtonComp.vue';
import { ref } from 'vue';

const emits = defineEmits(["content", "close"]);
const content = ref("");
const start = ref("");
const end = ref("");
const priority = ref("");

const buttonTouched = ref(false);

const addTodo = () => {
  buttonTouched.value = true;

  if(validLastDate() && validDates() && validContent() && validPriority()){
    emits("todo", { content: content.value, start: start.value, end: end.value, priority: priority.value });

    content.value = "";
    start.value = "";
    end.value="";
    priority.value="";
    buttonTouched.value = false;
    closeModal();
  }
};

const closeModal = () => {
  emits("close");
};

const validDates = () => {
  let ret = true;
  if(start.value == "" || end.value == ""){
    ret=false;
  }
  return ret;
};

const validLastDate = () => {
  let ret = true;
  if(new Date(start.value) > new Date(end.value)){
    ret=false;
  }
  return ret;
};

const validContent = () => {
  let ret = true;
  if(content.value.length < 1){
    ret=false;
  }
  return ret;
};

const validPriority = () => {
  let ret = false;
  if(priority.value == "lower" || priority.value == "medium" || priority.value == "higher"){
    ret=true;
  }
  return ret;
};

</script>

<template>
    <div class="alert">
      <div class="relative alert__modal p-10">
        <div class="flex flex-col items-center justify-center w-full">
          <button
            class="absolute top-0 right-0 p-4"
            @click="closeModal"
            >
            <img
              class="w-6 h-6"
              src="https://cdn-icons-png.flaticon.com/512/2976/2976286.png"
              alt="Close"
            >
          </button>
          <h1 class="customfont mt-2">Add Todo</h1>
        </div>



        <form @submit="loginHandler">
          <input class="h-40 rounded-lg text-center" type="text" v-model="content" placeholder="Write what you need to do...">
          <template v-if="buttonTouched && !validContent()">
            <div class="errmsg">
              <p>Please enter something</p>
            </div>
          </template>
          <div class="flex w-full items-center">
            <p class="mr-4">from...</p><input class="rounded-full" type="date" v-model="start" placeholder="start">
          </div>
          <div class="flex w-full items-center">
            <p class="mr-4">to...</p><input class="rounded-full" type="date" v-model="end" placeholder="end">
          </div>
          <template v-if="buttonTouched && !validDates()">
            <div class="errmsg">
              <p>invalid date(s).</p>
            </div>
          </template>
          <template v-if="buttonTouched && !validLastDate()">
              <div class="errmsg">
                <p>the end date must be later than the start date</p>
              </div>
          </template>
          <select class="rounded-full" v-model="priority" name="priority" id="prio-select">
            <option value="">--Please choose the priority--</option>
            <option value="higher">Higher</option>
            <option value="medium">Medium</option>
            <option value="lower">Lower</option>
          </select>
          <template v-if="buttonTouched && !validPriority()">
              <div class="errmsg">
                <p>invalid priority</p>
              </div>
          </template>
          <div class="alert__modal__btns">
            <ButtonComp @click.prevent="addTodo()" text="Ok" width="120px" height="40px" :isValid="true"></ButtonComp>
          </div>
        </form>
      </div>
    </div>
</template>

<style lang="scss" scoped>
.alert {
  @apply fixed inset-0 flex justify-center items-center w-full h-full z-[20];
  background-color: rgba(0, 0, 0, 0.75);

  &__modal {
    @apply flex flex-col justify-center items-center h-auto w-auto rounded-md bg-white;
  }

  &__modal__text {
    @apply flex justify-center items-center text-lg;
  }

  &__modal__btns {
    @apply flex justify-center w-full mt-10;
  }

  &__button{
    @apply flex justify-center items-center w-10 h-full;
  }

  &__icon{
    @apply w-5 ;
    @apply hover:scale-110;
  }

  h1{
    @apply mb-5;
  }

  input, select{
    @apply outline-none w-full p-3 bg-stone-100	;
  }

  form {
    @apply flex flex-col justify-center items-center w-[300px] gap-3 space-y-4;
  }

  .errmsg {
    @apply flex w-full text-red-500 text-sm ml-5;
  }
}
</style>