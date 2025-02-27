<script setup>
import { ref, onMounted } from 'vue';

const rutas = ref([]);
const guias = ref([]);
const guiasDisponibles = ref([]);
const mostrarModalDuplicarRuta = ref(false);
const formData = ref({
    fecha: '',
    hora: '',
    guia_id: ''
});
const rutaSeleccionada = ref(null);

const obtenerRutas = async () => {
    try {
        const response = await fetch('http://localhost/freetours/api.php/rutas');
        const data = await response.json();
        rutas.value = data.filter(ruta => ruta.fecha >= new Date().toISOString().split('T')[0]);
    } catch (error) {
        console.error('Error al obtener rutas:', error);
    }
};

const obtenerGuias = async () => {
    try {
        const response = await fetch('http://localhost/freetours/api.php/usuarios');
        const data = await response.json();
        guias.value = data.filter(u => u.rol.toLowerCase() === 'guia');
    } catch (error) {
        console.error('Error al obtener guias:', error);
    }
};

function obtenerGuiasDisponibles(fecha) {
  fetch(`http://localhost/freetours/api.php/asignaciones?fecha=${fecha}`, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => guiasDisponibles.value = data)
    .catch(error => console.error('Error:', error));
    return guiasDisponibles.value;
}

const abrirModalDuplicarRuta = (ruta) => {
    rutaSeleccionada.value = ruta;
    formData.value.fecha = '';
    formData.value.hora = '';
    formData.value.guia_id = '';
    mostrarModalDuplicarRuta.value = true;
    obtenerGuiasDisponibles(ruta.fecha); // Llamar a la función para obtener guías disponibles
};

const duplicarRuta = () => {
    if (!formData.value.fecha || !formData.value.hora || !formData.value.guia_id) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    const datosNuevaRuta = {
        titulo: rutaSeleccionada.value.titulo,
        localidad: rutaSeleccionada.value.localidad,
        descripcion: rutaSeleccionada.value.descripcion,
        foto: rutaSeleccionada.value.foto,
        fecha: formData.value.fecha,
        hora: formData.value.hora + ":00",
        latitud: rutaSeleccionada.value.latitud,
        longitud: rutaSeleccionada.value.longitud,
        guia_id: formData.value.guia_id
    };

    fetch("http://localhost/freetours/api.php/rutas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosNuevaRuta)
    })
        .then(res => res.json())
        .then(data => {
            console.log("Respuesta de la API:", data);
            if (data.status === "success") {
                mostrarModalDuplicarRuta.value = false;
                obtenerRutas();
            }
        })
        .catch(error => {
            console.error("Error al crear la ruta:", error);
        });
};

onMounted(() => {
    obtenerGuias();
    obtenerRutas();
});
</script>

<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-6 mb-5" v-for="ruta in rutas" :key="ruta.id">
                <div class="card h-100 efectoHover bg-light shadow-lg">
                    <img :src="ruta.foto" class="card-img-top imagenRuta" :alt="ruta.titulo" />
                    <div class="mt-2 bg-light">
                        <h4 class="text-center custom-title text-decoration-underline">{{ ruta.titulo }}</h4>
                        <p class="text-center mb-2 text-muted">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green"
                                class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                <path
                                    d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                            </svg>
                            {{ ruta.localidad }}
                        </p>
                    </div>
                    <div class="card-footer p-0">
                        <div class="row g-0 text-center">
                            <div class="col-4">
                                <button
                                    class="btn btn-light bg-light btn-sm fw-bolder fs-5 w-100 rounded-0 border-0 footer">{{
                                        ruta.fecha }}</button>
                            </div>
                            <div class="col-4">
                                <button @click="abrirModalDuplicarRuta(ruta)"
                                    class="btn btn-success fw-bold fs-5 btn-sm w-100 rounded-0 border-0 footer">Duplicar</button>
                            </div>
                            <div class="col-4">
                                <select @focus="obtenerGuiasDisponibles(ruta.fecha)"
                                    class="form-select form-select-sm fw-bolder fs-5 text-center bg-light w-100 rounded-0 border-0 footer">
                                    <option :selected="!ruta.guia_id">{{ ruta.guia_nombre || 'Sin guía' }}</option>
                                    <option v-for="guia in guiasDisponibles" :key="guia.id" :value="guia.id">{{ guia.nombre }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para duplicar ruta -->
    <div v-if="mostrarModalDuplicarRuta" class="modal fade show" style="display: block;" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Duplicar Ruta</h5>
                    <button type="button" class="btn-close" @click="mostrarModalDuplicarRuta = false"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="duplicarRuta">
                        <div class="mb-3">
                            <label for="fecha" class="form-label">Fecha</label>
                            <input type="date" id="fecha" v-model="formData.fecha" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="hora" class="form-label">Hora</label>
                            <input type="time" id="hora" v-model="formData.hora" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="guia" class="form-label">Guía</label>
                            <select id="guia" v-model="formData.guia_id" class="form-select" required>
                                <option value="" disabled>Seleccione un guía</option>
                                <option v-for="guia in guiasDisponibles" :key="guia.id" :value="guia.id">{{ guia.nombre }}</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-success w-100">Duplicar</button>
                    </form>
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
