<script setup>
import { ref, onMounted } from "vue";
import router from "@/router";

//Comprobamos si el usuario es administrador
const sesion = localStorage.getItem("sesion");
const rol = sesion ? JSON.parse(sesion).rol : null;

if (rol != "admin") {
  router.push("/");
}

const formData = ref({
    fecha: "",
    hora: "",
    guia_id: "",
});

const guias = ref([]);
const guiasDisponibles = ref([]);

const rutas = ref([]);
const rutaSeleccionada = ref(null);
const rutaAEliminar = ref(null);

const mostrarModalDuplicarRuta = ref(false);
const mostrarModalEliminarRuta = ref(false);

const errorDuplicarRuta = ref(false);

//Función para obtener las rutas
function obtenerRutas() {
    fetch("http://localhost/freetours/api.php/rutas")
        .then((response) => response.json())
        .then((data) => {
            rutas.value = data;
            rutas.value.forEach((ruta) => {
                obtenerValoracionMedia(ruta).then((valoracionMedia) => {
                    ruta.valoracionMedia = valoracionMedia;
                });
            });
        })
        .catch((error) => {
            console.error("Error al obtener rutas:", error);
        });
}

//Función para obtener los guías
function obtenerGuias() {
    fetch("http://localhost/freetours/api.php/usuarios")
        .then((response) => response.json())
        .then((data) => {
            guias.value = data.filter((u) => u.rol.toLowerCase() === "guia");
        })
        .catch((error) => {
            console.error("Error al obtener guias:", error);
        });
}

//Función para obtener los guías disponibles en una fecha
function obtenerGuiasDisponibles(fecha) {
    fetch(`http://localhost/freetours/api.php/asignaciones?fecha=${fecha}`, {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => (guiasDisponibles.value = data))
        .catch((error) => console.error("Error:", error));
    return guiasDisponibles.value;
}

//Función para obtener la valoración media de una ruta
function obtenerValoracionMedia(ruta) {
    return fetch(`http://localhost/freetours/api.php/valoraciones?ruta_id=${ruta.id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then((data) => {
            let valoracionesRuta = data.map(valoracion => valoracion.puntuacion);
            if (valoracionesRuta.length === 0) {
                return null;
            }
            let valoracionMediaRuta = valoracionesRuta.reduce((acumulador, valoracionActual) => acumulador + valoracionActual, 0) / valoracionesRuta.length;
            return valoracionMediaRuta;
        })
        .catch((error) => {
            console.error(`Error al obtener las valoraciones para la ruta ${ruta.id}:`, error);
        });
}

//Función para abrir el modal de duplicar una ruta
function abrirModalDuplicarRuta(ruta) {
    rutaSeleccionada.value = ruta;
    formData.value.fecha = "";
    formData.value.hora = "";
    formData.value.guia_id = "";
    errorDuplicarRuta.value = false;
    mostrarModalDuplicarRuta.value = true;
    obtenerGuiasDisponibles(ruta.fecha);
}

//Función para duplicar una ruta
function duplicarRuta() {
    if (
        !formData.value.fecha ||
        !formData.value.hora ||
        !formData.value.guia_id
    ) {
        errorDuplicarRuta.value = true;
        return;
    }

    errorDuplicarRuta.value = false;

    const datosNuevaRuta = {
        titulo: rutaSeleccionada.value.titulo,
        localidad: rutaSeleccionada.value.localidad,
        descripcion: rutaSeleccionada.value.descripcion,
        foto: rutaSeleccionada.value.foto,
        fecha: formData.value.fecha,
        hora: formData.value.hora + ":00",
        latitud: rutaSeleccionada.value.latitud,
        longitud: rutaSeleccionada.value.longitud,
        guia_id: formData.value.guia_id,
    };

    fetch("http://localhost/freetours/api.php/rutas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datosNuevaRuta),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "success") {
                mostrarModalDuplicarRuta.value = false;
                obtenerRutas();
            }
        })
        .catch((error) => {
            console.error("Error al crear la ruta:", error);
        });
}

//Función para actualizar el guía de una ruta
function actualizarGuia(ruta_id, guia_id) {
    fetch(`http://localhost/freetours/api.php/asignaciones`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ruta_id, guia_id }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "success") {
                obtenerRutas();
            }
        })
        .catch((error) => {
            console.error("Error al actualizar el guía:", error);
        });
}

function abrirModalEliminarRuta(ruta) {
    rutaAEliminar.value = ruta;
    mostrarModalEliminarRuta.value = true;
}

//Función para eliminar una ruta
function eliminarRuta() {
    fetch(`http://localhost/freetours/api.php/rutas/?id=${rutaAEliminar.value.id}`, {
        method: "DELETE",
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "success") {
                mostrarModalEliminarRuta.value = false;
                obtenerRutas();
            }
        })
        .catch((error) => {
            console.error("Error al eliminar la ruta:", error);
        });
}

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
                        <p v-if="ruta.valoracionMedia !== null" class="text-center mb-2 fst-italic">
                            <img class="mb-1" src="../assets/images/estrella.png" alt="Icono de valoración" height="20" />
                            Media de valoración: {{ ruta.valoracionMedia }}
                        </p>
                        <p v-else class="text-center mb-2 fst-italic">
                            <img class="mb-1" src="../assets/images/estrella.png" alt="Icono de valoración" height="20" />
                             Sin valoraciones aún
                        </p>
                    </div>
                    <div class="card-footer p-0">
                        <div class="row g-0 text-center">
                            <div class="col-4">
                                <button @click="abrirModalEliminarRuta(ruta)"
                                    class="btn btn-danger fw-bold fs-5 btn-sm w-100 rounded-0 border-0 footer" aria-label="Eliminar ruta">
                                    Eliminar
                                </button>
                            </div>
                            <div class="col-4">
                                <button @click="abrirModalDuplicarRuta(ruta)"
                                    class="btn btn-success fw-bold fs-5 btn-sm w-100 rounded-0 border-0 footer" aria-label="Duplicar ruta">
                                    Duplicar
                                </button>
                            </div>
                            <div class="col-4">
                                <select @focus="obtenerGuiasDisponibles(ruta.fecha)"
                                    @change="actualizarGuia(ruta.id, $event.target.value)"
                                    class="form-select form-select-sm fw-bolder fs-5 text-center bg-light w-100 rounded-0 border-0 footer" aria-label="Seleccionar guía">
                                    <option :selected="!ruta.guia_id">
                                        {{ ruta.guia_nombre || "Sin guía" }}
                                    </option>
                                    <option v-for="guia in guiasDisponibles" :key="guia.id" :value="guia.id">
                                        {{ guia.nombre }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para duplicar ruta -->
    <div v-if="mostrarModalDuplicarRuta" class="modal fade show" style="display: block" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="duplicarRutaModalLabel">Duplicar Ruta</h5>
                    <button type="button" class="btn-close" @click="mostrarModalDuplicarRuta = false" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="duplicarRuta">
                        <div class="mb-3">
                            <label for="fecha" class="form-label">Fecha</label>
                            <input type="date" id="fecha" v-model="formData.fecha" class="form-control" aria-label="Fecha" />
                        </div>
                        <div class="mb-3">
                            <label for="hora" class="form-label">Hora</label>
                            <input type="time" id="hora" step="1800" min="09:00" max="21:00" v-model="formData.hora"
                                class="form-control" aria-label="Hora" />
                        </div>
                        <div class="mb-3">
                            <label for="guia" class="form-label">Guía</label>
                            <select id="guia" v-model="formData.guia_id" class="form-select" aria-label="Seleccionar guía">
                                <option value="" disabled>
                                    Seleccione un guía
                                </option>
                                <option v-for="guia in guiasDisponibles" :key="guia.id" :value="guia.id">
                                    {{ guia.nombre }}
                                </option>
                            </select>
                        </div>
                        <div v-if="errorDuplicarRuta" class="alert alert-danger mb-3">
                            Rellena todos los campos
                        </div>
                        <button type="submit" class="btn btn-success w-100" aria-label="Duplicar ruta">
                            Duplicar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para eliminar ruta -->
    <div v-if="mostrarModalEliminarRuta" class="modal fade show" style="display: block" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="eliminarRutaModalLabel">Eliminar Ruta</h5>
                    <button type="button" class="btn-close" @click="mostrarModalEliminarRuta = false" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    <p>¿Seguro que desea eliminar la ruta {{ rutaAEliminar.titulo }}?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary"
                        @click="mostrarModalEliminarRuta = false" aria-label="Cancelar">Cancelar</button>
                    <button type="button" class="btn btn-danger" @click="eliminarRuta" aria-label="Eliminar ruta">Eliminar</button>
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
