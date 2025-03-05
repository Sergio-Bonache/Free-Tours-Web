<script setup>
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter();
const emit = defineEmits(["sesionCerrada"])
const props = defineProps({
  datosUsuario: Object,
  usuarioAutenticado: Object
})

function cerrarSesion() {
  emit("sesionCerrada", null)
  localStorage.removeItem("sesion")
  router.push("/")
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #EEEEEE;">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">
        <img src="../assets/images/palmera-fondo-verde.png" alt="Home" height="50">
      </RouterLink>
      <h3 class="text-secondary mt-2 fw-bold" @click="router.push('/')">Viajes Quinto Pino</h3>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto d-flex align-items-center">
          <!--Opciones de navbar para usuarios sin registrar-->
          <li v-if="datosUsuario?.rol == 'cliente' || datosUsuario?.rol == null" class="nav-item">
            <RouterLink class="nav-link fs-5" to="/rutasDisponibles">Rutas Disponibles</RouterLink>
          </li>
          <!--Opciones de navbar para clientes-->
          <li v-if="datosUsuario?.rol == 'cliente'" class="nav-item">
            <RouterLink class="nav-link fs-5" to="/rutasRealizadas">Rutas Realizadas</RouterLink>
          </li>
          <li v-if="datosUsuario?.rol == 'cliente'" class="nav-item">
            <RouterLink class="nav-link fs-5" to="/rutasPendientes">Rutas Pendientes</RouterLink>
          </li>
          <!--Opciones de navbar para guias-->
          <li v-if="datosUsuario?.rol == 'guia'" class="nav-item">
            <RouterLink class="nav-link fs-5" to="/misRutas">Mis Rutas</RouterLink>
          </li>
          <!--Opciones de navbar para administradores-->
          <li v-if="datosUsuario?.rol == 'admin'" class="nav-item">
            <RouterLink class="nav-link fs-5" to="/crearRuta">Crear Ruta</RouterLink>
          </li>
          <li v-if="datosUsuario?.rol == 'admin'" class="nav-item">
            <RouterLink class="nav-link fs-5" to="/gestionRutas">Gestionar Rutas</RouterLink>
          </li>
          <li v-if="datosUsuario?.rol == 'admin'" class="nav-item">
            <RouterLink class="nav-link fs-5" to="/gestionUsuarios">Gestionar Usuarios</RouterLink>
          </li> 
          
          <!--Botones de login y signup si el usuario no está logueado-->
          <li class="nav-item ps-4" v-if="!usuarioAutenticado">
            <RouterLink to="/login">
              <button class="btn btn-dark">Iniciar Sesión</button>
            </RouterLink>
          </li>
          <li class="nav-item" v-if="!usuarioAutenticado">
            <RouterLink to="/signup">
              <button class="btn btn-outline-dark ms-2">Crear Cuenta</button>
            </RouterLink>
          </li>

          <li v-if="usuarioAutenticado" class="nav-item d-flex align-items-center ps-5">
            <span class="navbar-text me-3">
              Bienvenido, {{ usuarioAutenticado.nombre }} ({{ usuarioAutenticado.rol }})
            </span>
            <button @click="cerrarSesion" class="btn btn-danger ms-2">Cerrar Sesión</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
