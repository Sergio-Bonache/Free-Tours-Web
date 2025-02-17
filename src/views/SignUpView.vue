<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter();
const form = ref({ nombreUsuario: '', email: '', password: '' })
const error = ref('')

async function registrarUsuario() {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  // Validaciones
  if (form.value.nombreUsuario.trim() == "" || form.value.email.trim() == "" || form.value.password.trim() == "") {
    error.value = "Es obligatorio introducir todos los datos";
    return;
  } else if (!emailRegex.test(form.value.email)) {
    error.value = 'El correo electrónico no es válido.';
    return;
  }

  // Primero, obtenemos la lista de usuarios existentes
  try {
    const responseUsuarios = await fetch('http://localhost/freetours/api.php/usuarios');
    if (!responseUsuarios.ok) {
      error.value = "Error al obtener la lista de usuarios";
      return;
    }
    const usuarios = await responseUsuarios.json();

    // Filtramos los usuarios para ver si ya existe el correo
    const correoExistente = usuarios.filter(usuario => usuario.email === form.value.email);
    if (correoExistente.length > 0) {
      error.value = "Ese correo se ha registrado previamente";
      return;
    }
  } catch (err) {
    error.value = "Error al obtener la lista de usuarios";
    console.error(err);
    return;
  }

  // Datos del usuario para enviar al backend
  const datosNuevoUsuario = {
    nombre: form.value.nombreUsuario,  // Cambié 'nombre' a 'usuario' porque es lo que tienes en 'form'
    email: form.value.email,
    contraseña: form.value.password
  };

  try {
    // Enviar la petición POST a la API
    const response = await fetch('http://localhost/freetours/api.php/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosNuevoUsuario),
    });

    // Obtener la respuesta

    // Si la respuesta es exitosa, redirige a login
    if (!response.ok) {
      error.value = 'Error al registrar el usuario';
    } else {
      router.push('/login');
    }
  } catch (err) {
    error.value = 'No se ha podido registrar al usuario.';
    console.error(err);
  }

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
                      placeholder="Ingresa tu nombre de usuario" />
                  </div>
                  <div class="mb-3">
                    <label for="email" class="form-label">Correo electrónico</label>
                    <input v-model="form.email" type="text" class="form-control" id="email"
                      placeholder="Ingresa tu correo electrónico" />
                  </div>
                  <div class="mb-3">
                    <label for="password" class="form-label">Contraseña</label>
                    <input v-model="form.password" type="password" class="form-control" id="password"
                      placeholder="Ingresa tu contraseña" />
                  </div>
                  <p v-if="error" class="text-danger mt-2">{{ error }}</p>
                  <div class="d-grid">
                    <button type="submit" class="btn btn-success">Registrarse</button>
                  </div>
                  <div class="mt-3 text-center">
                    <RouterLink to="/login" class="text-success text-decoration-none">¿Ya tienes cuenta? Inicia sesión
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
