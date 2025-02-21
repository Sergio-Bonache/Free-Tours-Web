<script setup>
import { ref, onMounted } from "vue";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const formData = ref({
  titulo: '',
  localidad: '',
  descripcion: '',
  imagenUrl: '',
  fecha: '',
  hora: '',
  latitud: '',
  longitud: '',
  puntoEncuentro: '' // No se valida este campo
  // guia: ''  // Tampoco se valida este campo si existiera
});

let map, marker;

onMounted(() => {
  map = L.map('map').setView([40.4168, -3.7038], 13); // Vista inicial en Madrid
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
});

const searchLocation = async () => {
  if (!formData.value.puntoEncuentro) return;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.value.puntoEncuentro)}`
  );
  const data = await response.json();

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
    const modal = new bootstrap.Modal(document.getElementById('locationNotFoundModal'));
    modal.show();
  }
};

const comprobarFormulario = () => {
  // Se comprueban todos los campos obligatorios excepto "puntoEncuentro" y "guia"
  const { titulo, localidad, descripcion, imagenUrl, fecha, hora, latitud, longitud } = formData.value;
  if (!titulo || !localidad || !descripcion || !imagenUrl || !fecha || !hora || !latitud || !longitud) {
    const incompleteModal = new bootstrap.Modal(document.getElementById('incompleteFieldsModal'));
    incompleteModal.show();
    return false;
  }
  return true;
};

const enviarDatosFormulario = () => {
  if (comprobarFormulario()) {
    // Procesar el envío del formulario
    console.log("Formulario enviado:", formData.value);
  }
};
</script>

<template>
  <div class="container mt-5 mb-5">
    <h2 class="mb-4">Crear Ruta</h2>
    <div class="card shadow bg-light">
      <div class="card-body">
        <!-- Se asocia el evento submit al método handleSubmit -->
        <form @submit.prevent="enviarDatosFormulario">
          <!-- Título y Localidad -->
          <div class="row mb-3">
            <div class="col">
              <label for="titulo" class="form-label">Título</label>
              <input type="text" class="form-control" id="titulo" v-model="formData.titulo" placeholder="Ingrese el título" />
            </div>
            <div class="col">
              <label for="localidad" class="form-label">Localidad</label>
              <input type="text" class="form-control" id="localidad" v-model="formData.localidad" placeholder="Ingrese la localidad" />
            </div>
          </div>

          <!-- Descripción -->
          <div class="mb-3">
            <label for="descripcion" class="form-label">Descripción</label>
            <textarea class="form-control" id="descripcion" v-model="formData.descripcion" rows="3" placeholder="Ingrese la descripción"></textarea>
          </div>

          <!-- URL de la imagen -->
          <div class="mb-3">
            <label for="imagenUrl" class="form-label">URL de la imagen</label>
            <input type="text" class="form-control" id="imagenUrl" v-model="formData.imagenUrl" placeholder="Ingrese la URL de la imagen" />
          </div>

          <!-- Fecha y Hora -->
          <div class="row mb-3">
            <div class="col">
              <label for="fecha" class="form-label">Fecha</label>
              <input type="date" class="form-control" id="fecha" v-model="formData.fecha" />
            </div>
            <div class="col">
              <label for="hora" class="form-label">Hora</label>
              <input type="time" class="form-control" id="hora" v-model="formData.hora" />
            </div>
          </div>

          <!-- Latitud y Longitud (solo lectura) -->
          <div class="row mb-3">
            <div class="col">
              <label for="latitud" class="form-label">Latitud</label>
              <input type="text" class="form-control" id="latitud" v-model="formData.latitud" placeholder="Ingrese la latitud" readonly />
            </div>
            <div class="col">
              <label for="longitud" class="form-label">Longitud</label>
              <input type="text" class="form-control" id="longitud" v-model="formData.longitud" placeholder="Ingrese la longitud" readonly />
            </div>
          </div>

          <!-- Punto de encuentro (no se valida) -->
          <div class="mb-4">
            <label class="form-label">Punto de encuentro</label>
            <div class="input-group">
              <input v-model="formData.puntoEncuentro" class="form-control" placeholder="Ej: Calle Fuentebuena, 23" />
              <button type="button" @click.prevent="searchLocation" class="btn btn-success ps-5 pe-5">Buscar</button>
            </div>
          </div>

          <!-- Mapa -->
          <div id="map" style="height: 400px;" class="mb-4"></div>

          <!-- Botones -->
          <div class="row mb-3">
            <div class="col">
              <button type="submit" class="btn btn-success w-100">Crear Ruta</button>
            </div>
            <div class="col">
              <button type="button" class="btn btn-danger w-100">Vaciar formulario</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal de ubicación no encontrada -->
  <div class="modal fade" id="locationNotFoundModal" tabindex="-1" aria-labelledby="locationNotFoundLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="locationNotFoundLabel">Ubicación no encontrada</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>No se ha podido encontrar la ubicación.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para campos incompletos -->
  <div class="modal fade" id="incompleteFieldsModal" tabindex="-1" aria-labelledby="incompleteFieldsModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="incompleteFieldsModalLabel">Campos incompletos</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Por favor, complete todos los campos obligatorios.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>
