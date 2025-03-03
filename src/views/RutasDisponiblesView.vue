<script setup>
import { ref, onMounted } from "vue";
import router from "@/router";
const rutas = ref([]);

const obtenerRutas = async () => {
    try {
        const response = await fetch(
            "http://localhost/freetours/api.php/rutas"
        );
        const data = await response.json();
        rutas.value = data.filter(
            (ruta) => ruta.fecha >= new Date().toISOString().split("T")[0]
        ).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    } catch (error) {
        console.error("Error al obtener rutas:", error);
    }
};

onMounted(() => {
    obtenerRutas();
});
</script>

<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-6 mb-5" v-for="ruta in rutas" :key="ruta.id">
                <div class="card h-100 efectoHover bg-light shadow-lg">
                        <img @click="router.push('ruta/' + ruta.id)" :src="ruta.foto" class="card-img-top imagenRuta" height="200" :alt="ruta.titulo" />
                        <div @click="router.push('ruta/' + ruta.id)" class="mt-2 bg-light">
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
                                <button class="btn btn-success fw-bold fs-5 btn-sm w-100 rounded-0 border-0 footer">
                                    ¡Reservar ahora!
                                </button>
                            </div>
                            <div class="col-5">
                                <div class="fw-bold fs-5 w-100 rounded-0 border-0 footer">
                                    <img src="../assets/images/guia-ico.png" alt="icono de guía turístico" height="35"
                                        class="me-2">
                                    {{ ruta.guia_nombre }}
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
</style>