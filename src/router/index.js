import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignUpView from '../views/SignUpView.vue'
import RutasRealizadasView from '../views/RutasRealizadasView.vue'
import RutasDisponiblesView from '../views/RutasDisponiblesView.vue'
import RutasPendientesView from '../views/RutasPendientesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/rutasDisponibles',
      name: 'disponibles',
      component: RutasDisponiblesView
    },
    {
      path: '/rutasRealizadas',
      name: 'realizadas',
      component: RutasRealizadasView
    },
    {
      path: '/rutasPendientes',
      name: 'pendientes',
      component: RutasPendientesView
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: LoginView
    },
    {
      path: '/signup',
      name: 'signup',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: SignUpView
    },
  ],
})

export default router