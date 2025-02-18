<script setup>
import { ref, onMounted } from 'vue';

const usuarios = ref([]);
const modal = ref(false);
const usuarioSeleccionado = ref(null);

async function obtenerUsuarios() {
  try {
    const respuesta = await fetch('http://localhost/freetours/api.php/usuarios');
    const datos = await respuesta.json();
    usuarios.value = datos.filter(u => u.rol.toLowerCase() !== 'admin');
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
}

async function actualizarUsuario(usuario) {
  try {
    const respuesta = await fetch(`http://localhost/freetours/api.php/usuarios?id=${usuario.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rol: usuario.rol })
    });
    if (!respuesta.ok) {
      alert('Error al actualizar usuario');
    }
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    alert('Error al actualizar usuario');
  }
}

function abrirModalEliminar(usuario) {
  usuarioSeleccionado.value = usuario;
  modal.value = true;
}

function cerrarModalEliminar() {
  modal.value = false;
  usuarioSeleccionado.value = null;
}

async function eliminarUsuario() {
  if (!usuarioSeleccionado.value) return;
  try {
    const respuesta = await fetch(`http://localhost/freetours/api.php/usuarios?id=${usuarioSeleccionado.value.id}`, {
      method: 'DELETE'
    });
    const resultado = await respuesta.json();
    if (resultado.status === 'success') {
      alert('Usuario eliminado correctamente');
      usuarios.value = usuarios.value.filter(u => u.id != usuarioSeleccionado.value.id);
    } 
  } catch (error) {
    console.error("Error eliminando usuario:", error);
  }
  cerrarModalEliminar();
}

onMounted(() => {
  obtenerUsuarios();
});
</script>

<template>
  <div class="container my-5">
    <h1 class="mb-4">Administración de Usuarios</h1>
    <div class="table-responsive shadow">
      <table class="table table-striped table-bordered table-hover align-middle">
        <thead class="table-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">Email</th>
            <th scope="col">Rol</th>
            <th scope="col" class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="table-light">
          <tr v-for="usuario in usuarios" :key="usuario.id">
            <td>{{ usuario.id }}</td>
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.email }}</td>
            <td>
              <select class="form-select" v-model="usuario.rol" @change="actualizarUsuario(usuario)">
                <option value="cliente" :selected="usuario.rol.toLowerCase() === 'cliente'">Cliente</option>
                <option value="guia" :selected="usuario.rol.toLowerCase() === 'guia'">Guía</option>
              </select>
            </td>
            <td class="text-center">
              <button class="btn btn-outline-danger btn-sm w-100 fs-6" @click="abrirModalEliminar(usuario)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de confirmación para eliminar usuario -->
    <div v-if="modal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Eliminación</h5>
            <button type="button" class="btn-close" @click="cerrarModalEliminar"></button>
          </div>
          <div class="modal-body">
            <p>¿Seguro que quieres eliminar a <b>{{ usuarioSeleccionado.nombre }}</b>?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrarModalEliminar">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="eliminarUsuario">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>