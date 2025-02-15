<script setup>
import router from "@/router";
import {ref} from "vue"
import { RouterLink } from "vue-router";
const emit = defineEmits(["sesionIniciada"])
const form = ref({ usuario: '', password: '' });
const error = ref('');

async function iniciarSesion() {
    try {
        const response = await fetch('/usuarios.json');
        const usuarios = await response.json();

        const usuarioEncontrado = usuarios.find(
            (u) => u.usuario === form.value.usuario && u.password === form.value.password
        );

        if (usuarioEncontrado) {


            //TODO: HABRÍA QUE NOTIFICAR A APP.VUE CON UN EMIT PARA QUE SEPA QUE LA SESIÓN ESTÁ INICIADA
            emit("sesionIniciada", {
                usuario:usuarioEncontrado.usuario,
                rol: usuarioEncontrado.rol
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
                  <h3 class="h4 fw-bold text-success">Login</h3>
                </div>
                <h6 class="h5 mb-0">¡Bienvenido de nuevo!</h6>
                <p class="text-muted mt-2 mb-5">
                  Ingresa tu correo electrónico y contraseña para acceder al panel de administración.
                </p>
                <form @submit.prevent="iniciarSesion">
                  <div class="mb-3">
                    <label for="username" class="form-label">Correo electrónico</label>
                    <input v-model="form.usuario" type="text" class="form-control" id="username" placeholder="Ingresa tu correo" />
                  </div>
                  <div class="mb-3">
                    <label for="password" class="form-label">Contraseña</label>
                    <input v-model="form.password" type="password" class="form-control" id="password" placeholder="Ingresa tu contraseña" />
                  </div>
                  <p v-if="error" class="text-danger mt-2">{{ error }}</p>
                  <div class="d-grid">
                    <button type="submit" class="btn btn-success">Iniciar Sesión</button>
                  </div>
                  <div class="mt-3 text-center">
                    <RouterLink to="/signup" class="text-success text-decoration-none">¿No tienes cuenta? Regístrate</RouterLink>
                  </div>
                </form>
              </div>
            </div>
            <!--Columna imagen-->
            <div class="col-lg-6 d-none d-lg-block position-relative" style="height: 92vh;">
              <img src="../assets/images/lake.jpg" alt="Lago" class="img-fluid w-100 h-100" style="object-fit: cover;" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
