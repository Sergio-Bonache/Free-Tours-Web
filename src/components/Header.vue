<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'

const emit = defineEmits(["sesionCerrada"])

const props = defineProps({
  datosUsuario: Object,
  title: String,
  usuarioAutenticado: Object
})

const usuario = props.datosUsuario;

function cerrarSesion() {
  emit("sesionCerrada", null)
  localStorage.removeItem("sesion")
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #EEEEEE;">
    <div class="container-fluid">
      <!-- Logo & Home link -->
      <RouterLink class="navbar-brand" to="/">
        <img src="../assets/images/palmera-fondo-verde.png" alt="Home" height="50">
      </RouterLink>

      <!-- Navbar toggler for mobile -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto d-flex align-items-center">
          <!-- Conditional navigation links based on role -->
          <li v-if="datosUsuario?.rol == 'profe'" class="nav-item">
            <a class="nav-link" href="#">Preguntas</a>
          </li>
          <li v-if="datosUsuario?.rol == 'profe'" class="nav-item">
            <a class="nav-link" href="#">Categorías</a>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/rutasDisponibles">Rutas Disponibles</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/rutasRealizadas">Rutas Realizadas</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/rutasPendientes">Rutas Pendientes</RouterLink>
          </li>
          
          
          <li class="nav-item" v-if="!usuarioAutenticado">
            <RouterLink to="/login">
              <button class="btn btn-dark">Iniciar Sesión</button>
            </RouterLink>
          </li>
          
          <li class="nav-item" v-if="!usuarioAutenticado">
            <RouterLink to="/signup">
              <button class="btn btn-outline-dark ms-2">Crear Cuenta</button>
            </RouterLink>
          </li>

          <!-- User info and logout button if authenticated -->
          <li v-if="usuarioAutenticado" class="nav-item d-flex align-items-center">
            <span class="navbar-text me-3">
              Bienvenido, {{ usuarioAutenticado.usuario }} ({{ usuarioAutenticado.rol }})
            </span>
            <!-- Logout button directly in the navbar -->
            <button @click="cerrarSesion" class="btn btn-danger ms-2">Cerrar Sesión</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
