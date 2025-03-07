<script setup>
import { ref, onMounted } from 'vue';

const emailCliente = ref(localStorage.getItem("sesion") ? JSON.parse(localStorage.getItem("sesion")).email : "");
const reservas = ref([]);
const rutasRealizadas = ref([]);
const calificacion = ref(1);

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
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
    }
};

const filtrarRutasRealizadas = () => {
    const hoy = new Date();
    rutasRealizadas.value = reservas.value.filter(reserva => new Date(reserva.ruta_fecha) < hoy);
};

const incrementarCalificacion = () => {
    if (calificacion.value < 5) {
        calificacion.value++;
    }
};

const decrementarCalificacion = () => {
    if (calificacion.value > 0) {
        calificacion.value--;
    }
};

const mostrarModalValoracion = () => {
    mostrarModalConfirmarValoracion.value = true;
}

const enviarCalificacion = async (reserva) => {
    try {
        const response = await fetch(`http://localhost/freetours/api.php/valoraciones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: reserva.cliente_id,
                ruta_id: reserva.ruta_id,
                estrellas: calificacion.value
            })
        });
        const data = await response.json();
        console.log('Respuesta:', data);
        error = data.message;
        obtenerReservas();
        mostrarModalConfirmarValoracion.value = false;
        mostrarModalValoracionHecha.value = true;
    } catch (error) {
        console.error('Error al calificar la ruta:', error);
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
                                <div class="col-3">
                                <div class="fw-bold fs-5 w-100 rounded-0 border-0 footer">
                                    <p class="mt-3">Calificar ruta</p>
                                </div>
                            </div>
                            <div class="col-1">
                                <button @click="decrementarCalificacion" class="btn bg-success fw-bold fs-5 btn-sm w-100 h-100 text-light rounded-0 border-0 footer">-</button>
                            </div>
                                <div class="col-3 d-flex align-items-center justify-content-center">
                                    <span class="mx-2">
                                        <span v-for="n in calificacion" :key="n" class="text-warning fs-4">★</span>
                                        <span v-for="n in (5 - calificacion)" :key="n" class="text-muted fs-4">★</span>
                                    </span>
                                </div>
                                <div class="col-1 d-flex align-items-center justify-content-center">
                                    <button @click="incrementarCalificacion" class="btn bg-success fw-bold fs-5 btn-sm w-100 h-100 text-light border-end rounded-0 border-0 footer">+</button>
                                </div>
                                <div class="col-4 d-flex align-items-center justify-content-center">
                                    <button @click="mostrarModalValoracion" class="btn btn-success fw-bold fs-5 btn-sm w-100 h-100 rounded-0 border-0 footer">Enviar Valoración</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modal mostrar confirmación de la valoración-->
                    <div v-if="mostrarModalConfirmarValoracion" class="modal fade show" style="display: block;" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Confirmar Valoración</h5>
                                    <button type="button" class="btn-close" @click="mostrarModalConfirmarValoracion = false"></button>
                                </div>
                                <div class="modal-body">
                                    <p>¿Está seguro de que desea valorar esta ruta?</p>
                                    <div class="d-flex justify-content-between">
                                        <button type="button" class="btn btn-success me-2 w-50" @click="enviarCalificacion(reserva)">Confirmar</button>
                                        <button type="button" class="btn btn-danger ms-2 w-50" @click="mostrarModalConfirmarValoracion = false">Cancelar</button>
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
                                    <h5 class="modal-title">Valoración enviada!</h5>
                                    <button type="button" class="btn-close" @click="mostrarModalValoracionHecha = false"></button>
                                </div>
                                <div class="modal-body">
                                    <p>¡{{error}}!</p>
                                    <div class="d-flex justify-content-between">
                                        <button type="button" class="btn btn-success me-2 w-100" @click="mostrarModalValoracionHecha = false">Confirmar</button>
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
</style>