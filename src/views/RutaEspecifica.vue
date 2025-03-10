<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import router from "@/router";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const sesion = localStorage.getItem("sesion");
const rol = sesion ? JSON.parse(sesion).rol : null;

const route = useRoute();
const ruta = ref(null);
let map;
let marker;

const mostrarModalReserva = ref(false);
const mostrarModalExito = ref(false);
const numPersonas = ref(1);
const emailCliente = ref(localStorage.getItem("sesion") ? JSON.parse(localStorage.getItem("sesion")).email : "");

//Inicializamos el mapa
function inicializarMapa() {
  if (!ruta.value || !ruta.value.latitud || !ruta.value.longitud) {
    console.error("Datos de ubicación no disponibles");
    return;
  }

  if (map) {
    map.remove();
  }

  map = L.map('map').setView([ruta.value.latitud, ruta.value.longitud], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  marker = L.marker([ruta.value.latitud, ruta.value.longitud]).addTo(map)
    .bindPopup(ruta.value.localidad)
    .openPopup();

  //Recargamos el mapa para que se muestre correctamente
  setTimeout(() => {
    map.invalidateSize();
  }, 1);
}

//Función para obtener una ruta específica
function obtenerRuta() {
  fetch(`http://localhost/freetours/api.php/rutas?id=${route.params.id}`)
    .then(response => response.json())
    .then(data => {
      ruta.value = data;
      inicializarMapa();
    })
    .catch(error => {
      console.error("Error al obtener la ruta:", error);
    });
}

function realizarReserva() {
  mostrarModalReserva.value = true;
}

function confirmarReserva() {
  const reservaData = {
    email: emailCliente.value,
    ruta_id: ruta.value.id,
    num_personas: numPersonas.value
  };

  fetch('http://localhost/freetours/api.php/reservas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reservaData)
  })
  .then(response => response.json())
  .then(data => {
    mostrarModalReserva.value = false;
    mostrarModalExito.value = true;
  })
  .catch(error => {
    console.error('Error al realizar la reserva:', error);
    alert('Error al realizar la reserva');
  });
}

onMounted(() => {
  obtenerRuta();
});
</script>

<template>
  <div class="container mt-5 mb-5">
    <div class="card shadow-lg bg-light mx-auto" style="max-width: 800px;">
      <img :src="ruta?.foto" class="card-img-top" alt="Imagen de la ruta">
      <div class="card-body">
        <div class="row">
          <div class="col-md-6 border-end d-flex align-items-center flex-column">
            <h2 class="text-capitalize text-decoration-underline">{{ ruta?.titulo }}</h2>
            <p class="mb-1 text-capitalize"><img src="../assets/images/location.png" alt="icono de ubicación" height="20" class="me-1"><strong>Localidad:</strong> {{ ruta?.localidad }}</p>
            <p class="mb-1 text-capitalize"><img src="../assets/images/calendar.png" alt="icono de calendario" height="16" class="me-1"><strong>Fecha:</strong> {{ ruta?.fecha }}</p>
            <p class="mb-1 text-capitalize"><img src="../assets/images/clock-ico.png" alt="icono de reloj" height="18" class="me-1"><strong>Hora:</strong> {{ ruta?.hora }}</p>
          </div>
          <div class="col-md-6 d-flex align-items-center flex-column border-start">
            <h3 class="fst-italic text-capitalize">Descripción</h3>
            <p class="shadow-lg p-3 bg-light rounded">{{ ruta?.descripcion }}</p>
          </div>
        </div>
        <div class="mt-3">
          <div id="map" class="rounded" style="height: 400px;" aria-label="Mapa de la ruta"></div>
        </div>
        <div class="row mt-3">
          <div class="col-md-12">
            <button v-if="rol == 'cliente'" class="btn btn-success w-100 fw-bold fs-5" @click="realizarReserva" aria-label="Reservar">¡Reservar!</button>
            <button v-else class="btn btn-success w-100 fw-bold" @click="router.push('/login')" aria-label="Iniciar sesión para reservar">¡Inicia sesión para reservar!</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para seleccionar el número de asistentes -->
  <div v-if="mostrarModalReserva" class="modal fade show" style="display: block;" tabindex="-1" aria-label="Modal de selección de número de asistentes">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Seleccionar número de asistentes</h5>
          <button type="button" class="btn-close" @click="mostrarModalReserva = false" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="confirmarReserva()">
            <div class="mb-3">
              <label for="numPersonas" class="form-label">Número de asistentes</label>
              <input type="number" id="numPersonas" v-model="numPersonas" class="form-control" min="1" max="8" required aria-label="Número de asistentes">
            </div>
            <button type="submit" class="btn btn-success w-100" aria-label="Confirmar reserva">Confirmar Reserva</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para mostrar el éxito de la reserva -->
  <div v-if="mostrarModalExito" class="modal fade show" style="display: block;" tabindex="-1" aria-label="Modal de éxito de reserva">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">¡Reserva realizada con éxito!</h5>
          <button type="button" class="btn-close" @click="mostrarModalExito = false" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <p>Su reserva ha sido realizada con éxito.</p>
          <button type="button" class="btn btn-success" @click="mostrarModalExito = false" aria-label="Cerrar">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.imagenRuta {
    max-height: 250px;
    object-fit: cover;
}

.footer {
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.efectoHover {
    transition: transform 0.3s ease;
}

.efectoHover:hover {
    transform: translateY(-5px);
}

.modal {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>
