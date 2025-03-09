<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter();
const form = ref({ nombreUsuario: '', email: '', password: '' })
const error = ref('')

function registrarUsuario() {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  //Validamos los datos del formulario
  if (form.value.nombreUsuario.trim() == "" || form.value.email.trim() == "" || form.value.password.trim() == "") {
    error.value = "Es obligatorio introducir todos los datos";
    return;
  } else if (!emailRegex.test(form.value.email)) {
    error.value = 'El correo electrónico no es válido.';
    return;
  }

  fetch('http://localhost/freetours/api.php/usuarios')
    .then(responseUsuarios => {
      if (!responseUsuarios.ok) {
        throw new Error("Error al obtener la lista de usuarios");
      }
      return responseUsuarios.json();
    })
    .then(usuarios => {
      //Filtramos los usuarios para ver si ya existe el correo
      const correoExistente = usuarios.filter(usuario => usuario.email === form.value.email);
      if (correoExistente.length > 0) {
        throw new Error("Ese correo se ha registrado previamente");
      }

      //Datos del usuario para enviar al backend
      const datosNuevoUsuario = {
        nombre: form.value.nombreUsuario,
        email: form.value.email,
        contraseña: form.value.password
      };

      //Enviar la petición POST a la API
      return fetch('http://localhost/freetours/api.php/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosNuevoUsuario),
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al registrar el usuario');
      }
      router.push('/login');
    })
    .catch(err => {
      error.value = err.message;
      console.error(err);
    });
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
                <form id="formRegistro" @submit.prevent="registrarUsuario">
                  <div class="mb-3">
                    <label for="username" class="form-label">Nombre de usuario</label>
                    <input v-model="form.nombreUsuario" type="text" class="form-control" id="username"
                      placeholder="Ingresa tu nombre de usuario" aria-label="Nombre de usuario" />
                  </div>
                  <div class="mb-3">
                    <label for="email" class="form-label">Correo electrónico</label>
                    <input v-model="form.email" type="text" class="form-control" id="email"
                      placeholder="Ingresa tu correo electrónico" aria-label="Correo electrónico" />
                  </div>
                  <div class="mb-3">
                    <label for="password" class="form-label">Contraseña</label>
                    <input v-model="form.password" type="password" class="form-control" id="password"
                      placeholder="Ingresa tu contraseña" aria-label="Contraseña" />
                  </div>
                  <p v-if="error" class="text-danger mt-2">{{ error }}</p>
                  <div class="d-grid">
                    <button type="submit" class="btn btn-success" aria-label="Registrarse">Registrarse</button>
                  </div>
                  <div class="mt-3 text-center">
                    <RouterLink to="/login" class="text-success text-decoration-none" aria-label="Inicia sesión">¿Ya tienes cuenta? Inicia sesión
                    </RouterLink>
                  </div>
                </form>
              </div>
            </div>
            <!--Columna imagen-->
            <div class="col-lg-6 d-none d-lg-block position-relative" style="height: 72vh;">
              <img src="../assets/images/lake.jpg" alt="Lago" class="img-fluid w-100 h-100"
                style="object-fit: cover;" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
