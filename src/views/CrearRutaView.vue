<script setup>
import { ref, onMounted } from "vue";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import router from "@/router";

//Comprbamos si el usuario es admin
const sesion = localStorage.getItem("sesion");
const rol = sesion ? JSON.parse(sesion).rol : null;

if (rol != "admin") {
  router.push("/");
}

const guiasDisponibles = ref([]);

const formData = ref({
  titulo: '',
  localidad: '',
  descripcion: '',
  imagenUrl: '',
  fecha: '',
  hora: '',
  latitud: '',
  longitud: '',
  puntoEncuentro: '',
  guia_id: ''
});

let fechaMomentoCreacion = new Date().toISOString().split('T')[0];


//Variables para mostrar los modales
const mostrarModalUbicacionNoEncontrada = ref(false);
const mostrarModalCamposIncompletos = ref(false);
const mostrarModalRutaCreada = ref(false);

//Creamos el mapa y el marcador
let map
let marker;

onMounted(() => {
  map = L.map('map').setView([50.84772403093738, 4.353098372274874], 13); //Punto inicial en Bruselas
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
});

//Función para buscar la ubicación introducida
function searchLocation() {
  if (formData.value.puntoEncuentro == ""){
    return;
  } 

  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.value.puntoEncuentro)}`)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        formData.value.latitud = data[0].lat;
        formData.value.longitud = data[0].lon;

        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        if (marker) marker.remove();

        marker = L.marker([lat, lon]).addTo(map)
          .bindPopup(formData.value.puntoEncuentro)
          .openPopup();
        map.setView([lat, lon], 13);
      } else {
        mostrarModalUbicacionNoEncontrada.value = true;
      }
    });
}

//Función para comprobar que los campos obligatorios están completos
function comprobarFormulario() {
  if (
    !formData.value.titulo ||
    !formData.value.localidad ||
    !formData.value.descripcion ||
    !formData.value.imagenUrl ||
    !formData.value.fecha ||
    !formData.value.hora ||
    !formData.value.latitud ||
    !formData.value.longitud
  ) {
    mostrarModalCamposIncompletos.value = true;
    return false;
  }
  return true;
}

//Función para enviar los datos del formulario
function enviarDatosFormulario() {
  if (comprobarFormulario()) {
    //Modificamos la hora para que concuerde con el formato de la base de datos.
    let horaConSegundos = formData.value.hora + ":00";

    const datosNuevaRuta = {
      titulo: formData.value.titulo,
      localidad: formData.value.localidad,
      descripcion: formData.value.descripcion,
      foto: formData.value.imagenUrl,
      fecha: formData.value.fecha,
      hora: horaConSegundos,
      latitud: formData.value.latitud,
      longitud: formData.value.longitud,
      guia_id: formData.value.guia_id
    };

    //Llamamos a la API y creamos la ruta.
    fetch("http://localhost/freetours/api.php/rutas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datosNuevaRuta)
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          //Si la ruta se crea mostramos un modal indicando que se ha creado la ruta y vaciamos el formulario.
          mostrarModalRutaCreada.value = true;
          vaciarFormulario();
        }
      })
      .catch(error => {
        console.error("Error al crear la ruta:", error);
      });
  }
}

//Función para vaciar el formulario
function vaciarFormulario() {
  formData.value.titulo = '';
  formData.value.localidad = '';
  formData.value.descripcion = '';
  formData.value.imagenUrl = '';
  formData.value.fecha = '';
  formData.value.hora = '';
  formData.value.latitud = '';
  formData.value.longitud = '';
  formData.value.puntoEncuentro = '';
  formData.value.guia_id = '';

  if (marker) {
    marker.remove();
    marker = null;
  }

  map.setView([50.84772403093738, 4.353098372274874], 13); //Restablece el punto inicial a Bruselas
}

//Función para obtener los guías disponibles en una fecha concreta
function obtenerGuiasDisponibles() {
  fetch(`http://localhost/freetours/api.php/asignaciones?fecha=${formData.value.fecha}`, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => guiasDisponibles.value = data)
    .catch(error => console.error('Error:', error));
}

//Función para obtener los guías
function obtenerGuias() {
  fetch('http://localhost/freetours/api.php/usuarios')
    .then(respuesta => respuesta.json())
    .then(datos => {
      guiasDisponibles.value = datos.filter(u => u.rol.toLowerCase() == 'guia');
    })
    .catch(error => {
      console.error("Error al obtener guias:", error);
    });
}

//Función para obtener el nombre de un guía a partir de su ID
function obtenerNombreGuiaPorId(guiaId) {
  const guiaBuscado = guiasDisponibles.value.find(guia => guia.id == guiaId);
  return guiaBuscado ? guiaBuscado.nombre : '';
}

onMounted(() => {
  obtenerGuias();
});
</script>

<template>
  <div class="container mt-5 mb-5">
    <h2 class="mb-4">Crear Ruta</h2>
    <div class="card shadow bg-light">
      <div class="card-body">
        <p class="fw-lighter fst-italic">Los campos marcados con❗son obligatorios.</p>
        <!-- Se asocia el evento submit al método enviarDatosFormulario -->
        <form @submit.prevent="enviarDatosFormulario">
          <!-- Título y Localidad -->
          <div class="row mb-3">
            <div class="col">
              <label for="titulo" class="form-label">Título❗</label>
              <input type="text" class="form-control" id="titulo" v-model="formData.titulo"
                placeholder="Ingrese el título" aria-label="Título" />
            </div>
            <div class="col">
              <label for="localidad" class="form-label">Localidad❗</label>
              <input type="text" class="form-control" id="localidad" v-model="formData.localidad"
                placeholder="Ingrese la localidad" aria-label="Localidad" />
            </div>
          </div>

          <!-- Descripción -->
          <div class="mb-3">
            <label for="descripcion" class="form-label">Descripción❗</label>
            <textarea class="form-control" id="descripcion" v-model="formData.descripcion" rows="3"
              placeholder="Ingrese la descripción" aria-label="Descripción"></textarea>
          </div>

          <!-- URL de la imagen -->
          <div class="mb-3">
            <label for="imagenUrl" class="form-label">URL de la imagen❗</label>
            <input type="text" class="form-control" id="imagenUrl" v-model="formData.imagenUrl"
              placeholder="Ingrese la URL de la imagen" aria-label="URL de la imagen" />
          </div>

          <!-- Fecha y Hora -->
          <div class="row mb-3">
            <div class="col">
              <label for="fecha" class="form-label">Fecha❗</label>
              <input type="date" class="form-control" @change="obtenerGuiasDisponibles()" :min="fechaMomentoCreacion" id="fecha" v-model="formData.fecha" aria-label="Fecha" />
            </div>
            <div class="col">
              <label for="hora" class="form-label">Hora❗</label>
              <input type="time" class="form-control" step="1800" id="hora" min="09:00" max="21:00"
                v-model="formData.hora" aria-label="Hora" />
            </div>
          </div>

          <!-- Guía -->
          <div class="mb-3" v-if="formData.fecha!= ''">
            <label for="guia" class="form-label">Guía</label>
            <select class="form-control" id="guia" v-model="formData.guia_id" aria-label="Guía">
              <option value="" disabled>Seleccione un guía</option>
              <option v-for="guia in guiasDisponibles" :key="guia.id" :value="guia.id"> Guía {{ obtenerNombreGuiaPorId(guia.id) }} con ID: {{ guia.id }}</option>
              <option value="singuia">Sin guía</option>
            </select>
          </div>

          <div class="mb-3" v-else>
            <label for="guia" class="form-label">Guía</label>
            <select class="form-control" id="guia" aria-label="Guía">
              <option value="" selected disabled>Seleccione una fecha primero</option>
            </select>
          </div>

          <!-- Latitud y Longitud (solo lectura) -->
          <div class="row mb-3">
            <div class="col">
              <label for="latitud" class="form-label">Latitud</label>
              <input type="text" class="form-control" id="latitud" v-model="formData.latitud"
                placeholder="Ingrese la latitud" readonly aria-label="Latitud" />
            </div>
            <div class="col">
              <label for="longitud" class="form-label">Longitud</label>
              <input type="text" class="form-control" id="longitud" v-model="formData.longitud"
                placeholder="Ingrese la longitud" readonly aria-label="Longitud" />
            </div>
          </div>

          <!-- Punto de encuentro (no se valida) -->
          <div class="mb-4">
            <label class="form-label">Punto de encuentro❗</label>
            <div class="input-group">
              <input v-model="formData.puntoEncuentro" class="form-control" placeholder="Calle Bonache, 2" aria-label="Punto de encuentro" />
              <button type="button" @click.prevent="searchLocation" class="btn btn-success ps-5 pe-5" aria-label="Buscar ubicación">Buscar</button>
            </div>
          </div>

          <!-- Mapa -->
          <div id="map" style="height: 400px;" class="mb-4" aria-label="Mapa"></div>

          <!-- Botones -->
          <div class="row mb-3">
            <div class="col">
              <button type="submit" class="btn btn-success w-100" aria-label="Crear Ruta">Crear Ruta</button>
            </div>
            <div class="col">
              <button type="button" class="btn btn-danger w-100" @click="vaciarFormulario" aria-label="Vaciar formulario">Vaciar formulario</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal de ubicación no encontrada (creado en el template) -->
  <div v-if="mostrarModalUbicacionNoEncontrada" class="modal fade show" id="locationNotFoundModal" tabindex="-1"
    aria-labelledby="locationNotFoundLabel" aria-hidden="true" style="display: block;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="locationNotFoundLabel">Ubicación no encontrada</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
            @click="mostrarModalUbicacionNoEncontrada = false"></button>
        </div>
        <div class="modal-body">
          <p>No se ha podido encontrar la ubicación.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
            @click="mostrarModalUbicacionNoEncontrada = false">Cerrar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para campos incompletos (creado en el template) -->
  <div v-if="mostrarModalCamposIncompletos" class="modal fade show" id="incompleteFieldsModal" tabindex="-1"
    aria-labelledby="incompleteFieldsModalLabel" aria-hidden="true" style="display: block;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="incompleteFieldsModalLabel">Campos incompletos</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
            @click="mostrarModalCamposIncompletos = false"></button>
        </div>
        <div class="modal-body">
          Por favor, complete todos los campos obligatorios.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
            @click="mostrarModalCamposIncompletos = false">Cerrar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para ruta creada -->
  <div v-if="mostrarModalRutaCreada" class="modal fade show" id="modalRutaCreada" tabindex="-1"
    aria-labelledby="modalRutaCreadaLabel" aria-hidden="true" style="display: block;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalRutaCreadaLabel">Ruta Creada</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
            @click="mostrarModalRutaCreada = false"></button>
        </div>
        <div class="modal-body d-flex justify-content-center align-items-center flex-column">
          <img src="../assets/images/success.png" height="100" width="100" alt="imagen de palmera">
          <p class="mt-3">¡La ruta ha sido creada!</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" data-bs-dismiss="modal"
            @click="mostrarModalRutaCreada = false">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>
