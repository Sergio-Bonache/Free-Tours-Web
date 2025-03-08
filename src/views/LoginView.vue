<script setup>
import router from "@/router";
import {ref} from "vue"
import { RouterLink } from "vue-router";
const emit = defineEmits(["sesionIniciada"])
const form = ref({ email: '', password: '' });
const error = ref('');

async function iniciarSesion() {
    try {
        const response = await fetch('http://localhost/freetours/api.php/usuarios');
        const usuarios = await response.json();

        const usuarioEncontrado = usuarios.find(
            (u) => u.email == form.value.email && u.contraseña == form.value.password
        );

        if (usuarioEncontrado) {
            emit("sesionIniciada", {
                nombre : usuarioEncontrado.nombre,
                email:usuarioEncontrado.email,
                rol: usuarioEncontrado.rol,
                id: usuarioEncontrado.id

            })
            error.value = '';
            router.push("/");
        } else {
            error.value = 'Usuario o contraseña incorrectos';
        }
    } catch (err) {
        error.value = 'Error al cargar los datos';
    }
}
</script>

<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-xl-10">
        <div class="card border-0 shadow">
          <div class="row g-0">
            <!--Formulario de login-->
            <div class="col-lg-6">
              <div class="p-5">
                <div class="mb-5">
                  <h3 class="h4 fw-bold text-success">Iniciar Sesión</h3>
                </div>
                <h6 class="h5 mb-0">¡Bienvenido de nuevo!</h6>
                <p class="text-muted mt-2 mb-5">
                  Ingresa tu correo electrónico y contraseña para acceder al panel de administración.
                </p>
                <form @submit.prevent="iniciarSesion">
                  <div class="mb-3">
                    <label for="email" class="form-label">Correo electrónico</label>
                    <input v-model="form.email" type="text" class="form-control" id="email" placeholder="Ingresa tu correo" aria-label="Correo electrónico" />
                  </div>
                  <div class="mb-3">
                    <label for="password" class="form-label">Contraseña</label>
                    <input v-model="form.password" type="password" class="form-control" id="password" placeholder="Ingresa tu contraseña" aria-label="Contraseña" />
                  </div>
                  <p v-if="error" class="text-danger mt-2">{{ error }}</p>
                  <div class="d-grid">
                    <button type="submit" class="btn btn-success" aria-label="Iniciar Sesión">Iniciar Sesión</button>
                  </div>
                  <div class="mt-3 text-center">
                    <RouterLink to="/signup" class="text-success text-decoration-none" aria-label="Regístrate">¿No tienes cuenta? Regístrate</RouterLink>
                  </div>
                </form>
              </div>
            </div>
            <!--Columna imagen-->
            <div class="col-lg-6 d-none d-lg-block position-relative" style="height: 72vh;">
              <img src="../assets/images/lake.jpg" alt="Lago" class="img-fluid w-100 h-100" style="object-fit: cover;" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
