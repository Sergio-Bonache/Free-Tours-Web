<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";

const sesion = localStorage.getItem("sesion");
const rol = sesion ? JSON.parse(sesion).rol : null;

const route = useRoute();
const fecha = route.params.fecha;
const localidad = route.params.localidad;
const rutas = ref([]);
const mostrarModalReserva = ref(false);
const mostrarModalExito = ref(false);
const rutaSeleccionada = ref(null);
const numPersonas = ref(1);
const emailCliente = ref(localStorage.getItem("sesion") ? JSON.parse(localStorage.getItem("sesion")).email : ""); // Obtener el email del cliente desde localStorage

//Función para obtener las rutas disponibles
function obtenerRutas() {
    fetch("http://localhost/freetours/api.php/rutas")
        .then(response => response.json())
        .then(data => {
            rutas.value = data.filter(
                (ruta) => {
                    if (localidad == '') {
                        return ruta.fecha == fecha && ruta.guia_id != null;
                    } else {
                        return ruta.fecha == fecha && ruta.localidad == localidad && ruta.guia_id != null;
                    }
                }
            ).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        })
        .catch(error => {
            console.error("Error al obtener rutas:", error);
        });
}

function realizarReserva(ruta) {
    rutaSeleccionada.value = ruta;
    mostrarModalReserva.value = true;
}

//Función para confirmar una reserva
function confirmarReserva() {
    const reservaData = {
        email: emailCliente.value,
        ruta_id: rutaSeleccionada.value.id,
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
    obtenerRutas();
});
</script>

<template>
    <div class="container mt-5">
        <h2 class="mb-4">Rutas Buscadas</h2>
        <div v-if="rutas.length == 0">
            <p>No se encontraron rutas para los criterios de búsqueda especificados.</p>
        </div>
        <div v-else>
            <div class="row">
                <div class="col-md-6 mb-5" v-for="ruta in rutas" :key="ruta.id">
                    <div class="card h-100 efectoHover bg-light shadow-lg">
                        <img @click="router.push('/ruta/' + ruta.id)" :src="ruta.foto" class="card-img-top imagenRuta" height="200" :alt="ruta.titulo" aria-label="Imagen de la ruta {{ ruta.titulo }}" />
                        <div @click="router.push('/ruta/' + ruta.id)" class="mt-2 bg-light" aria-label="Detalles de la ruta">
                            <h4 class="text-center custom-title text-decoration-underline">
                                {{ ruta.titulo }}
                            </h4>
                            <p class="text-center mb-2">
                                <img src="../assets/images/location.png" alt="Icono de ubicación" height="20" />
                                {{ ruta.localidad }}
                            </p>
                            <p class="text-center mb-2 fst-italic">
                                <img src="../assets/images/clock-ico.png" alt="Icono de ubicación" height="16" />
                                {{ ruta.fecha }} - {{ ruta.hora }}
                            </p>
                        </div>
                        <div class="card-footer p-0">
                            <div class="row g-0 text-center">
                                <div class="col-7">
                                    <button v-if="rol == 'cliente'" @click="realizarReserva(ruta)" class="btn btn-success fw-bold fs-5 btn-sm w-100 rounded-0 border-0 footer" aria-label="Reservar ahora">
                                        ¡Reservar ahora!
                                    </button>
                                    <button v-else @click="router.push('/login')" class="btn btn-success fw-bold fs-5 btn-sm w-100 rounded-0 border-0 footer" aria-label="Inicia sesión para reservar la ruta">
                                        ¡Inicia sesión para reservar!
                                    </button>
                                </div>
                                <div class="col-5">
                                    <div class="fw-bold fs-5 w-100 rounded-0 border-0 footer" aria-label="Guía: {{ ruta.guia_nombre }}">
                                        <img src="../assets/images/guia-ico.png" alt="icono de guía turístico" height="35" class="me-2">
                                        {{ ruta.guia_nombre }}
                                    </div>
                                </div>
                            </div>
                        </div>
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
                    <button type="button" class="btn-close" @click="mostrarModalReserva = false" aria-label="Cerrar modal"></button>
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
                    <button type="button" class="btn-close" @click="mostrarModalExito = false" aria-label="Cerrar modal"></button>
                </div>
                <div class="modal-body">
                    <p>Su reserva ha sido realizada con éxito.</p>
                    <button type="button" class="btn btn-success w-100" @click="mostrarModalExito = false" aria-label="Cerrar modal de éxito">Cerrar</button>
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