<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const ruta = ref(null);

const obtenerRuta = async () => {
    try {
        const response = await fetch(`http://localhost/freetours/api.php/rutas?id=${route.params.id}`);
        const data = await response.json();
        ruta.value = data;
        console.log(ruta.value);
    } catch (error) {
        console.error("Error al obtener la ruta:", error);
    }
};

onMounted(() => {
    obtenerRuta();
});
</script>

<template>
    <div v-if="ruta">
        <h1>{{ ruta.titulo }}</h1>
        <p>Id de la ruta: {{ ruta.id }}</p>
        <p>Nombre de la ruta: {{ ruta.titulo }}</p>
        <p>Localidad: {{ ruta.localidad }}</p>
        <p>Descripción: {{ ruta.descripcion }}</p>
        <p>Fecha: {{ ruta.fecha }}</p>
        <p>Hora: {{ ruta.hora }}</p>
        <p>Guía: {{ ruta.guia_nombre }}</p>
        <img :src="ruta.foto" alt="Imagen de la ruta" />
    </div>
</template>