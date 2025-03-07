<script setup>
import { ref, onMounted } from 'vue';

const emailCliente = ref(localStorage.getItem("sesion") ? JSON.parse(localStorage.getItem("sesion")).email : "");
const reservas = ref([]);
const rutasPendientes = ref([]);
const mostrarModalCancelacion = ref(false);
const reservaSeleccionada = ref(null);

const obtenerReservas = async () => {
    try {
        const response = await fetch(`http://localhost/freetours/api.php/reservas?email=${emailCliente.value}`, {
            method: 'GET',
        });
        const data = await response.json();
        reservas.value = data;
        console.log(reservas.value);
        filtrarRutasPendientes();
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
    }
};

const filtrarRutasPendientes = () => {
    const hoy = new Date();
    rutasPendientes.value = reservas.value.filter(reserva => new Date(reserva.ruta_fecha) >= hoy);
};

const actualizarAsistentes = async (reserva, numPersonas) => {
    try {
        const response = await fetch(`http://localhost/freetours/api.php/reservas?id=${reserva.reserva_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ num_personas: numPersonas })
        });
        const data = await response.json();
        console.log('Respuesta:', data);
        obtenerReservas();
    } catch (error) {
        console.error('Error al actualizar el número de asistentes:', error);
    }
};

const cancelarRuta = (reserva) => {
    reservaSeleccionada.value = reserva;
    mostrarModalCancelacion.value = true;
};

const confirmarCancelacion = async () => {
    try {
        const response = await fetch(`http://localhost/freetours/api.php/reservas?id=${reservaSeleccionada.value.reserva_id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        console.log('Respuesta:', data);
        mostrarModalCancelacion.value = false;
        obtenerReservas();
    } catch (error) {
        console.error('Error al cancelar la reserva:', error);
    }
};

onMounted(() => {
    obtenerReservas();
});
</script>

<template>
    <div class="container mt-5">
        <h1 class="mb-4">Rutas Pendientes</h1>
        <div v-if="rutasPendientes.length == 0">
            <p>No tienes rutas pendientes.</p>
        </div>
        <div v-else>
            <div class="row">
                <div class="col-md-6 mb-5" v-for="reserva in rutasPendientes" :key="reserva.id">
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
                                <div class="col-8">
                                    <select 
                                        class="form-select form-select-sm fw-bolder fs-5 text-center bg-light w-100 rounded-0 border-0 footer"
                                        @change="actualizarAsistentes(reserva, $event.target.value)"
                                    >
                                        <option selected disabled>Asistentes: {{ reserva.num_personas }}</option>
                                        <option v-for="n in 8" :key="n" :value="n">Asistentes: {{ n }}</option>
                                    </select>
                                </div>
                                <div class="col-4">
                                    <button @click="cancelarRuta(reserva)" class="btn btn-danger fw-bold fs-5 btn-sm w-100 rounded-0 border-0 footer">
                                        Cancelar Ruta
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para confirmar la cancelación -->
    <div v-if="mostrarModalCancelacion" class="modal fade show" style="display: block;" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirmar Cancelación</h5>
                    <button type="button" class="btn-close" @click="mostrarModalCancelacion = false"></button>
                </div>
                <div class="modal-body">
                    <p>¿Está seguro de que desea cancelar esta ruta?</p>
                    <div class="d-flex justify-content-between">
                        <button type="button" class="btn btn-danger me-2 w-50" @click="confirmarCancelacion">Confirmar</button>
                        <button type="button" class="btn btn-secondary ms-2 w-50" @click="mostrarModalCancelacion = false">Cancelar</button>
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

.modal {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>