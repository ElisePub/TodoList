import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import ResetView from '../views/ResetView.vue'
import { useAuthStore } from "../stores/use-auth"


const routes = [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/reset',
      name: 'reset',
      component: ResetView
    },
    {
      path: '/home',
      name: 'home',
      meta:{
        user: true
      },
      component: HomeView
    },
    {
      path: '/favorites',
      name: 'favorites',
      meta:{
        user: true
      },
      component: FavoritesView
    }
  ]

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async(to,from,next) => {
  const authStore = useAuthStore();
  if (!authStore.isLoggedIn && to.name !== "login" && to.name !== "register" && to.name !=="home" && to.name !=="reset")  return next({name: "home"});
  next();
})



export default router
