import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignUpView from '../views/SignUpView.vue'
import RutasRealizadasView from '../views/RutasRealizadasView.vue'
import RutasDisponiblesView from '../views/RutasDisponiblesView.vue'
import RutasPendientesView from '../views/RutasPendientesView.vue'
import MisRutasView from '../views/MisRutasView.vue'
import CrearRutaView from '../views/CrearRutaView.vue'
import GestionRutasView from '../views/GestionRutasView.vue'
import GestionUsuariosView from '../views/GestionUsuariosView.vue'

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
    {
      path: '/misRutas',
      name: 'misrutas',
      component: MisRutasView
    },
    {
      path: '/crearRuta',
      name: 'crearruta',
      component: CrearRutaView
    },
    {
      path: '/gestionRutas',
      name: 'gestionrutas',
      component: GestionRutasView
    },
    {
      path: '/gestionUsuarios',
      name: 'gestionusuarios',
      component: GestionUsuariosView
    },
  ],
})

export default router