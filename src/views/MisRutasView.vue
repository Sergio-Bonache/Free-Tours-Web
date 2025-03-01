<script setup>
import { ref, onMounted } from "vue";

const rutas = ref([]);
const usuarioActual = JSON.parse(localStorage.getItem("sesion")); // Simulación del usuario actual

function obtenerRutasAsignadas() {
    fetch(`http://localhost/freetours/api.php/rutas?guia_id=${usuarioActual.id}`)
        .then(response => response.json())
        .then(data => {
            rutas.value = data
                .filter(ruta => ruta.fecha >= new Date().toISOString().split("T")[0] && ruta.guia_id == usuarioActual.id)
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        })
        .catch(error => {
            console.error("Error al obtener rutas asignadas:", error);
        });
}

onMounted(() => {
    obtenerRutasAsignadas();
});
</script>

<template>
    <div class="container mt-5">
        <div class="row">
            <h2>¡Estas son tus rutas {{ usuarioActual.nombre }}!</h2>
            <p class="fs-5 fst-italic text-muted">Disfruta de enseñar a los demás lo que te gusta...</p>
            <div class="col-md-6 mb-5" v-for="ruta in rutas" :key="ruta.id">
                <div class="card h-100 efectoHover bg-light shadow-lg">
                    <img :src="ruta.foto" class="card-img-top imagenRuta" height="200" :alt="ruta.titulo" />
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

.efectoHover {
    transition: transform 0.3s ease;
}

.efectoHover:hover {
    transform: translateY(-5px);
}
</style>