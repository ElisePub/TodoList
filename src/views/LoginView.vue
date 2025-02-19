<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import ButtonComp from '../components/ButtonComp.vue';
import FooterComp from "../components/FooterComp.vue";
import { useAuthStore } from '../stores/use-auth';
import { useRegexpStore } from '../stores/use-regexp';

const emits = defineEmits(["login"]);

const email = ref("");
const password = ref("");
const errMsg = ref();

const authStore = useAuthStore();
const regexpStore = useRegexpStore();
const router = useRouter();

const loginHandler = async (e) => {
  e.preventDefault();
  await authStore.loginHandler(email.value, password.value);
  if(!authStore.isLoggedIn) return errMsg.value = authStore.errMsg; 
  emits("login");
  router.push("/home");
};

const goToRegister = () => {
  router.push("/register");
};

const goToReset = () => {
  router.push("/reset");
};

const isValidEmail = computed(() => {
  return regexpStore.checkEmail(email.value);
});

const isValidPassword = computed(() => {
  return regexpStore.checkPassword(password.value);
});

</script>

<template>

  <div class="login">
    <h1 class="customfont">Login your account</h1>
    <form @submit="loginHandler">
      <input type="email" v-model="email" placeholder="email">
      <template v-if="!isValidEmail && email.length > 0">
        <div class="errmsg">
          <p>Please enter a valid email</p>
        </div>
      </template>
      <input type="password" v-model="password" placeholder="password">
      <template v-if="!isValidPassword && password.length > 0 ">
        <div class="errmsg">
          <p>Min 6 characters</p>
        </div>
      </template>
      <ButtonComp :isValid="isValidEmail && isValidPassword" text="Login" width="120px" height="40px"></ButtonComp>
      <template v-if="errMsg">
        <p class="errmsg justify-center mr-5">{{ errMsg }}</p>
      </template>
      <div class="pt-4 items-center">
        <p class="text-gray-200">Don't you have an account? <span @click="goToRegister" class="register__link">Register</span></p>
        <p class="text-gray-200">Forgot your password? <span @click="goToReset" class="register__link">Reset</span></p>
      </div>
    </form>
  </div>
  <FooterComp></FooterComp>

</template>

<style lang="scss" scoped>
.login {
  @apply flex flex-col justify-center items-center h-[400px];

  h1{
    @apply mb-5;
  }

  input {
    @apply outline-none w-full p-3 rounded-full;
  }

  form {
    @apply flex flex-col justify-center items-center w-[300px] gap-3;
  }

  .register__link {
    @apply underline cursor-pointer text-sky-500 hover:text-sky-300
  }

  .errmsg {
    @apply flex w-full text-red-500 text-sm ml-5;
  }
}
</style>