<script setup>
import { ref, onMounted } from "vue";

// Variable reactiva para almacenar las rutas
const rutas = ref([]);

function obtenerRutas() {
    fetch("http://localhost/freetours/api.php/rutas")
        .then(response => response.json())
        .then(data => {
            rutas.value = data;
        })
        .catch(error => console.error("Error al obtener rutas:", error));
}

async function obtenerGuias() {
    try {
        const respuesta = await fetch('http://localhost/freetours/api.php/usuarios');
        const datos = await respuesta.json();
        guiasDisponibles.value = datos.filter(u => u.rol.toLowerCase() == 'guia');
    } catch (error) {
        console.error("Error al obtener guias:", error);
    }
}

// Obtener las rutas desde la API al montar el componente
onMounted(() => {
    obtenerGuias();
    obtenerRutas();
});
</script>

<template>
    <div class="container mt-3">
        <div class="row">
            <!-- Se itera sobre las rutas para generar una tarjeta por cada una -->
            <div class="col-md-4 mb-3" v-for="ruta in rutas" :key="ruta.id">
                <div class="card" style="width: 100%;">
                    <!-- Título de la tarjeta -->
                    <h5 class="card-title text-center">{{ ruta.titulo }}</h5>
                    <!-- Imagen -->
                    <img :src="ruta.foto" class="card-img-top" :alt="ruta.titulo">
                    <!-- Pie de la tarjeta con tres elementos sin bordes redondeados entre ellos -->
                    <div class="card-footer p-0">
                        <div class="row g-0 w-100 text-center">
                            <!-- Fecha -->
                            <div class="col-4">
                                <span class="btn btn-light btn-sm w-100 rounded-0 border-0">
                                    {{ ruta.fecha }}
                                </span>
                            </div>
                            <!-- Botón Duplicar -->
                            <div class="col-4">
                                <button class="btn btn-success btn-sm w-100 rounded-0 border-0">
                                    Duplicar
                                </button>
                            </div>
                            <!-- Select de Guía -->
                            <div class="col-4">
                                <select class="form-select form-select-sm w-100 rounded-0 border-0">
                                    <option :selected="!ruta.guia_id">
                                        {{ ruta.guia_nombre || "Sin guía" }}
                                    </option>
                                    <option value="1">Guía 1</option>
                                    <option value="2">Guía 2</option>
                                    <option value="3">Guía 3</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
