<script setup>
import { ref, onMounted } from "vue";


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

const obtenerRutas = async () => {
    try {
        const response = await fetch(
            "http://localhost/freetours/api.php/rutas"
        );
        const data = await response.json();
        rutas.value = data.filter(
            (ruta) => ruta.fecha >= new Date().toISOString().split("T")[0]
        );
    } catch (error) {
        console.error("Error al obtener rutas:", error);
    }
};

const obtenerGuias = async () => {
    try {
        const response = await fetch(
            "http://localhost/freetours/api.php/usuarios"
        );
        const data = await response.json();
        guias.value = data.filter((u) => u.rol.toLowerCase() === "guia");
    } catch (error) {
        console.error("Error al obtener guias:", error);
    }
};

function obtenerGuiasDisponibles(fecha) {
    fetch(`http://localhost/freetours/api.php/asignaciones?fecha=${fecha}`, {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => (guiasDisponibles.value = data))
        .catch((error) => console.error("Error:", error));
    return guiasDisponibles.value;
}

const abrirModalDuplicarRuta = (ruta) => {
    rutaSeleccionada.value = ruta;
    formData.value.fecha = "";
    formData.value.hora = "";
    formData.value.guia_id = "";
    errorDuplicarRuta.value = false;
    mostrarModalDuplicarRuta.value = true;
    obtenerGuiasDisponibles(ruta.fecha); // Llamar a la función para obtener guías disponibles
};

const duplicarRuta = () => {
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
            console.log("Respuesta de la API:", data);
            if (data.status === "success") {
                mostrarModalDuplicarRuta.value = false;
                obtenerRutas();
            }
        })
        .catch((error) => {
            console.error("Error al crear la ruta:", error);
        });
};

const actualizarGuia = (ruta_id, guia_id) => {
    fetch(`http://localhost/freetours/api.php/asignaciones`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ruta_id, guia_id }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("Respuesta de la API:", data);
            if (data.status === "success") {
                obtenerRutas();
            }
        })
        .catch((error) => {
            console.error("Error al actualizar el guía:", error);
        });
};

const abrirModalEliminarRuta = (ruta) => {
    rutaAEliminar.value = ruta;
    mostrarModalEliminarRuta.value = true;
};

const eliminarRuta = () => {
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
                            <div class="col-4">
                                <button @click="abrirModalEliminarRuta(ruta)"
                                    class="btn btn-danger fw-bold fs-5 btn-sm w-100 rounded-0 border-0 footer">
                                    Eliminar
                                </button>
                            </div>
                            <div class="col-4">
                                <button @click="abrirModalDuplicarRuta(ruta)"
                                    class="btn btn-success fw-bold fs-5 btn-sm w-100 rounded-0 border-0 footer">
                                    Duplicar
                                </button>
                            </div>
                            <div class="col-4">
                                <select @focus="obtenerGuiasDisponibles(ruta.fecha)"
                                    @change="actualizarGuia(ruta.id, $event.target.value)"
                                    class="form-select form-select-sm fw-bolder fs-5 text-center bg-light w-100 rounded-0 border-0 footer">
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
                    <h5 class="modal-title">Duplicar Ruta</h5>
                    <button type="button" class="btn-close" @click="mostrarModalDuplicarRuta = false"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="duplicarRuta">
                        <div class="mb-3">
                            <label for="fecha" class="form-label">Fecha</label>
                            <input type="date" id="fecha" v-model="formData.fecha" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label for="hora" class="form-label">Hora</label>
                            <input type="time" id="hora" step="1800" min="09:00" max="21:00" v-model="formData.hora"
                                class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label for="guia" class="form-label">Guía</label>
                            <select id="guia" v-model="formData.guia_id" class="form-select">
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
                        <button type="submit" class="btn btn-success w-100">
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
                    <h5 class="modal-title">Eliminar Ruta</h5>
                    <button type="button" class="btn-close" @click="mostrarModalEliminarRuta = false"></button>
                </div>
                <div class="modal-body">
                    <p>¿Seguro que desea eliminar la ruta {{ rutaAEliminar.titulo }}?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary"
                        @click="mostrarModalEliminarRuta = false">Cancelar</button>
                    <button type="button" class="btn btn-danger" @click="eliminarRuta">Eliminar</button>
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
