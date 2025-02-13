<script setup>
import Content from './components/Content.vue';
import Card from './components/Card.vue';
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import { ref } from 'vue';


//Abría que controlar cuando se inicia sesión y se cierra con un emit desde el hijo y tener un dato
// de sesión reactivo para pasarlo a la barra de navegación como props
const sesion= ref(JSON.parse(localStorage.getItem("sesion")));
function actualizaDatosSesion(usuario) {
  sesion.value = usuario;
  localStorage.setItem('sesion', JSON.stringify(usuario));
}

function irAbout() {
    router.push("/login")
}
</script>

<template>
  <div class="layout">

    <!--HACER E INCLUIR COMPONENTE DE BARRA DE NAVEGACIÓN CON OPCIONES VISIBLES SEGÚN EL ROL DEL USUARIO-->
    <Header :usuarioAutenticado="sesion" @sesionCerrada="actualizaDatosSesion" title="Aplicacion Juana" :datosUsuario="sesion"></Header>

    <RouterView @sesionIniciada="actualizaDatosSesion"></RouterView>
    <Footer></Footer>
  </div>
</template>


<style scoped>
.layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
</style>