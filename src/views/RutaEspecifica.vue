<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const route = useRoute();
const ruta = ref(null);
let map = null;
let marker = null;

const obtenerRuta = async () => {
  try {
    const response = await fetch(`http://localhost/freetours/api.php/rutas?id=${route.params.id}`);
    const data = await response.json();
    ruta.value = data;
    console.log(ruta.value);
  } catch (error) {
    console.error("Error al obtener la ruta:", error);
  }
};

onMounted(() => {
  obtenerRuta();
});

watch(ruta => {
  if ( ruta.latitud && ruta.longitud) {
    // Inicializa el mapa centrado en el punto de encuentro
    map = L.map('map').setView([parseFloat(ruta.latitud), parseFloat(ruta.longitud)], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    // Agrega un marker en el punto exacto
    marker = L.marker([parseFloat(ruta.latitud), parseFloat(ruta.longitud)]).addTo(map)
      .bindPopup("Punto de Encuentro")
      .openPopup();
  }
});
</script>

<template>
  <div class="container mt-5 mb-5">
    <div class="card shadow-lg mx-auto" style="max-width: 800px;">
      <!-- Foto de la ruta -->
      <img :src="ruta.foto" class="card-img-top" alt="Imagen de la ruta">
      
      <div class="card-body">
        <!-- Información de la ruta -->
        <div class="row">
          <!-- Columna izquierda: título, localidad y fecha/hora -->
          <div class="col-md-6">
            <h2 class="text-uppercase text-decoration-underline">{{ ruta.titulo }}</h2>
            <p class="mb-1"><strong>Localidad:</strong> {{ ruta.localidad }}</p>
            <p class="mb-1">{{ ruta.fecha }} - {{ ruta.hora }}</p>
          </div>
          <!-- Columna derecha: descripción -->
          <div class="col-md-6">
            <p>{{ ruta.descripcion }}</p>
          </div>
        </div>
        
        <!-- Mapa con Leaflet -->
        <div class="mt-3">
          <div id="map" style="height: 400px;"></div>
        </div>

        <!-- Botón para reservar y select para elegir número de asistentes -->
        <div class="row mt-3">
          <div class="col-md-6">
            <button class="btn btn-success w-100">Reservar</button>
          </div>
          <div class="col-md-6">
            <select class="form-select">
              <option selected disabled>Número de asistentes</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
