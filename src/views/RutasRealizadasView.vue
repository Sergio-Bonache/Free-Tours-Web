<script setup>
import { ref, onMounted } from 'vue';
import router from "@/router";

const sesion = localStorage.getItem("sesion");
const rol = sesion ? JSON.parse(sesion).rol : null;

if (rol != "cliente") {
  router.push("/");
}

const emailCliente = ref(localStorage.getItem("sesion") ? JSON.parse(localStorage.getItem("sesion")).email : "");
const reservas = ref([]);
const rutasRealizadas = ref([]);
const rutaSeleccionada = ref(null); 
const estrellasActuales = ref(0);

const mostrarModalConfirmarValoracion = ref(false);
const mostrarModalValoracionHecha = ref(false);

let error = ref('');

const obtenerReservas = async () => {
    try {
        const response = await fetch(`http://localhost/freetours/api.php/reservas?email=${emailCliente.value}`, {
            method: 'GET',
        });
        const data = await response.json();
        reservas.value = data;
        console.log(reservas.value);
        filtrarRutasRealizadas();
        await obtenerValoraciones();
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
    }
};

const obtenerValoraciones = async () => {
    try {
        const response = await fetch(`http://localhost/freetours/api.php/valoraciones?user_id=${emailCliente.value}`);
        if (!response.ok) throw new Error("Error al obtener las valoraciones");

        const valoraciones = await response.json();
        reservas.value.forEach(reserva => {
            const valoracion = valoraciones.find(v => v.ruta_id === reserva.ruta_id);
            if (valoracion) {
                reserva.valoracion = valoracion.puntuacion;
                reserva.comentario = valoracion.comentario; // Añade el comentario a la reserva
            } else {
                reserva.comentario = ""; // Inicializa el comentario si no existe
            }
        });
    } catch (error) {
        console.error('Error al obtener las valoraciones:', error);
    }
};

const filtrarRutasRealizadas = () => {
    const hoy = new Date();
    rutasRealizadas.value = reservas.value.filter(reserva => new Date(reserva.ruta_fecha) < hoy);
};

const incrementarCalificacion = (reserva) => {
    if (estrellasActuales.value < 5) {
        estrellasActuales.value++;
        console.log("ID "+ reserva.ruta_id + ": " +reserva.valoracion);
    }
};

const decrementarCalificacion = (reserva) => {
    if (estrellasActuales.value > 1) {
        estrellasActuales.value--;
        console.log("ID "+ reserva.ruta_id + ": " +reserva.valoracion);
    }
};

const mostrarModalValoracion = (reserva) => {
    mostrarModalConfirmarValoracion.value = true;
    console.log(reserva.reserva_id);
    rutaSeleccionada.value = reserva; // Asigna el valor de reserva a rutaSeleccionada.value
    console.log("Ruta seleccionada", rutaSeleccionada.value);
}

const enviarCalificacion = async () => {
    console.log(rutaSeleccionada.value);
    const nuevaValoracion = {
        user_id: rutaSeleccionada.value.cliente_id,
        ruta_id: rutaSeleccionada.value.ruta_id,
        estrellas: estrellasActuales.value,
        comentario: rutaSeleccionada.value.comentario // Añade el comentario a la solicitud
    };

    try {
        const response = await fetch('http://localhost/freetours/api.php/valoraciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaValoracion)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.status);
        }

        const data = await response.json();
        console.log('Valoración creada:', data);
        error.value = data.message;
        obtenerReservas();
        mostrarModalConfirmarValoracion.value = false;
        mostrarModalValoracionHecha.value = true;
        rutaSeleccionada.value = null;
    } catch (error) {
        console.error('Error al crear la valoración:', error);
    }
};

onMounted(() => {
    obtenerReservas();
});
</script>

<template>
    <div class="container mt-5">
        <h1 class="mb-4">Rutas Realizadas</h1>
        <div v-if="rutasRealizadas.length == 0">
            <p>No tienes rutas realizadas.</p>
        </div>
        <div v-else>
            <div class="row">
                <div class="col-md-6 mb-5" v-for="reserva in rutasRealizadas" :key="reserva.id">
                    <div class="card h-100 efectoHover bg-light shadow-lg">
                        <img :src="reserva.ruta_foto" class="card-img-top imagenRuta" height="200" :alt="reserva.titulo" />
                        <div class="mt-2 bg-light">
                            <h4 class="text-center custom-title text-decoration-underline">
                                {{ reserva.ruta_titulo }}
                            </h4>
                            <p class="text-center mb-2">
                                <img src="../assets/images/location.png" alt="Icono de ubicación" height="20" />
                                {{ reserva.ruta_localidad }}
                            </p>
                            <p class="text-center mb-2 fst-italic">
                                <img src="../assets/images/clock-ico.png" alt="Icono de ubicación" height="16" />
                                {{ reserva.ruta_fecha }} - {{ reserva.ruta_hora }}
                            </p>
                        </div>
                        <div class="card-footer p-0">
                            <div class="row g-0 text-center">
                                <div class="col-12">
                                    <div v-if="reserva.valoracion== null" class="bg-success fw-bold text-light fs-5 w-100 rounded-0 border-0 footer">
                                        <p class="mt-3">Calificar ruta</p>
                                    </div>
                                    <div v-else class="bg-light text-success fw-bold fs-5 w-100 rounded-0 border-0 footer">
                                        <p class="mt-3">¡Ya has valorado esta ruta!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer p-0">
                            <div class="row g-0 text-center">
                                <div v-if="reserva.valoracion == null" class="col-6">
                                    <textarea v-model="reserva.comentario" class="form-control bg-light fs-6 text-break pb-3 rounded-0" rows="3" placeholder="Escribe tu comentario aquí" aria-label="Escribe tu comentario aquí"></textarea>
                                </div>
                                <div class="col-6">
                                    <div v-if="reserva.valoracion == null" class="row g-0">
                                        <div class="col-12 d-flex align-items-center p-1 justify-content-center">
                                            <span class="mx-2" aria-label="Calificación de estrellas">
                                                <span v-for="n in estrellasActuales" :key="n" class="text-warning fs-4">★</span>
                                                <span v-for="n in (5 - estrellasActuales)" :key="n" class="text-muted fs-4">★</span>
                                            </span>
                                        </div>
                                        <div class="col-6">
                                            <button @click="decrementarCalificacion(reserva)" class="btn bg-dark text-light fw-bold pb-1 fs-3 btn-sm w-100 h-100 rounded-0 border-top border-end footer" aria-label="Disminuir calificación">-</button>
                                        </div>
                                        <div class="col-6">
                                            <button @click="incrementarCalificacion(reserva)" class="btn bg-dark text-light fw-bold pb-1 fs-3 btn-sm w-100 h-100 rounded-0 border-top footer" aria-label="Aumentar calificación">+</button>
                                        </div>
                                    </div>
                                    <div v-else class="row g-0">
                                        <div class="col-12 mt-3 pb-3">
                                            <div class="ms-5 d-flex align-items-center">
                                                <h4 class="text-nowrap mt-2 ps-5 pe-4">Tu valoración:</h4>
                                                <span v-for="n in reserva.valoracion" :key="n" class="text-warning mb-1 fs-1">★</span>
                                                <span v-for="n in (5 - reserva.valoracion)" :key="n" class="text-muted mb-1 fs-1">★</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="reserva.valoracion == null" class="card-footer p-0">
                            <div class="row g-0 text-center">
                                <div class="col-12 d-flex align-items-center justify-content-center ">
                                    <button @click="mostrarModalValoracion(reserva)" class="btn btn-success fw-bold fs-5 btn-sm w-100 h-100 rounded-0 border-0 footer" aria-label="Enviar valoración">Enviar Valoración</button>
                                </div>
                            </div>
                        </div>
                        <div v-else class="card-footer p-0">
                            <div class="row g-0 text-center">
                                <div class="col-12 d-flex align-items-center justify-content-center ">
                                    <span class="text-success fw-bold fs-5 mt-2 pb-2 w-100 h-100 d-flex align-items-center justify-content-center">Gracias por tu valoración</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modal mostrar confirmación de la valoración-->
                    <div v-if="mostrarModalConfirmarValoracion" class="modal fade show" style="display: block;" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="confirmarValoracionModalLabel">Confirmar Valoración</h5>
                                    <button type="button" class="btn-close" @click="mostrarModalConfirmarValoracion = false" aria-label="Cerrar"></button>
                                </div>
                                <div class="modal-body">
                                    <p>¿Está seguro de que desea valorar esta ruta?</p>
                                    <div class="d-flex justify-content-between">
                                        <button type="button" class="btn btn-success me-2 w-50" @click="enviarCalificacion" aria-label="Confirmar valoración">Confirmar</button>
                                        <button type="button" class="btn btn-danger ms-2 w-50" @click="mostrarModalConfirmarValoracion = false" aria-label="Cancelar valoración">Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modal mostrar confirmación de valoración hecha -->
                    <div v-if="mostrarModalValoracionHecha" class="modal fade show" style="display: block;" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="valoracionHechaModalLabel">Valoración enviada!</h5>
                                    <button type="button" class="btn-close" @click="mostrarModalValoracionHecha = false" aria-label="Cerrar"></button>
                                </div>
                                <div class="modal-body">
                                    <p>¡{{error}}!</p>
                                    <div class="d-flex justify-content-between">
                                        <button type="button" class="btn btn-success me-2 w-100" @click="mostrarModalValoracionHecha = false" aria-label="Confirmar">Confirmar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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

.star {
    font-size: 12rem;
    cursor: pointer;
}

textarea {
  resize: none;
}

</style>