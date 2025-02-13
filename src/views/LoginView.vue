<script setup>
import router from "@/router";
import {ref} from "vue"
const emit = defineEmits(["sesionIniciada"])
const form = ref({ usuario: '', password: '' });
const error = ref('');

async function iniciarSesion() {
    try {
        const response = await fetch('/usuarios.json');
        const usuarios = await response.json();

        const usuarioEncontrado = usuarios.find(
            (u) => u.usuario === form.value.usuario && u.password === form.value.password
        );

        if (usuarioEncontrado) {


            //TODO: HABRÍA QUE NOTIFICAR A APP.VUE CON UN EMIT PARA QUE SEPA QUE LA SESIÓN ESTÁ INICIADA
            emit("sesionIniciada", {
                usuario:usuarioEncontrado.usuario,
                rol: usuarioEncontrado.rol
            })
            error.value = '';
            router.push("/");
        } else {
            error.value = 'Usuario o contraseña incorrectos';
        }
    } catch (err) {
        error.value = 'Error al cargar los datos';
    }
}
</script>

<template>
    <h1>Hola soy el login</h1>
    <form>
        <label for="username"></label>
        <input v-model="form.usuario" type="text" id="username" placeholder="username">
        <label for="password"></label>
        <input v-model="form.password" type="password" id="password" placeholder="password">
        <p v-if="error" class="text-danger mt-2">{{ error }}</p>
        <button v-on:click.prevent="iniciarSesion">Iniciar Sesión</button>
    </form>
</template>