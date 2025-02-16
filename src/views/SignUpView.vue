<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter();
const form = ref({ usuario: '', email: '', password: '' })
const error = ref('')

function registrarUsuario() {
  // Aquí iría la lógica para registrar al usuario (por ejemplo, llamada a una API)
  // Luego, redirige al login o a donde necesites.
  router.push("/login")
}
</script>

<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-xl-10">
        <div class="card border-0 shadow">
          <div class="row g-0">
            <!--Formulario-->
            <div class="col-lg-6">
              <div class="p-5">
                <div class="mb-5">
                  <h3 class="h4 fw-bold text-success">Registro</h3>
                </div>
                <h6 class="h5 mb-0">Crea tu cuenta</h6>
                <p class="text-muted mt-2 mb-5">Completa tus datos para registrarte.</p>
                <form @submit.prevent="registrarUsuario">
                  <div class="mb-3">
                    <label for="username" class="form-label">Nombre de usuario</label>
                    <input v-model="form.usuario" type="text" class="form-control" id="username" placeholder="Ingresa tu nombre de usuario" />
                  </div>
                  <div class="mb-3">
                    <label for="email" class="form-label">Correo electrónico</label>
                    <input v-model="form.email" type="email" class="form-control" id="email" placeholder="Ingresa tu correo electrónico" />
                  </div>
                  <div class="mb-3">
                    <label for="password" class="form-label">Contraseña</label>
                    <input v-model="form.password" type="password" class="form-control" id="password" placeholder="Ingresa tu contraseña" />
                  </div>
                  <p v-if="error" class="text-danger mt-2">{{ error }}</p>
                  <div class="d-grid">
                    <button type="submit" class="btn btn-success">Registrarse</button>
                  </div>
                  <div class="mt-3 text-center">
                    <RouterLink to="/login" class="text-success text-decoration-none">¿Ya tienes cuenta? Inicia sesión</RouterLink>
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
