<script setup>

import Banner from '../components/Banner.vue';
</script>
<template>
  <Banner />
  <!--Quién Somos-->
  <div class="container my-5">
    <div class="row d-flex align-items-center justify-content-between">
      <div class="col-md-6">
        <h2>¿Quiénes Somos?</h2>
        <p class="lh-lg">
          En Viajes Quinto Pino, ofrecemos free tours con guías locales <br>
          apasionados que combinan historia, cultura y entretenimiento. <br>
          Creemos en un turismo accesible y auténtico, donde tú decides <br>
          el valor de la experiencia. Únete a nuestros recorridos y descubre <br>
           lugares de una manera única.
        </p>
      </div>
      <div class="col-md-6">
        <video id="videoControles" class="img-fluid" controls>
          <source src="../assets/images/video.mp4" type="video/mp4">
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
    </div>
  </div>
  <!--Carrusel-->
  <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active"
        aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1"
        aria-label="Slide 2"></button>
      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2"
        aria-label="Slide 3"></button>
    </div>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img src="../assets/images/antartida.jpg" class="d-block w-100" alt="...">
        <div class="carousel-caption d-none d-md-block">
          <h2>Polo Sur</h2>
        </div>
      </div>
      <div class="carousel-item">
        <img src="../assets/images/lisboa.png" class="d-block w-100" alt="...">
        <div class="carousel-caption d-none d-md-block">
          <h2>Lisboa, Portugal</h2>
        </div>
      </div>
      <div class="carousel-item">
        <img src="../assets/images/norway.jpg" class="d-block w-100" alt="...">
        <div class="carousel-caption d-none d-md-block">
          <h2>Tromsø, Noruega</h2>
        </div>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>


<style scoped>
img {
  filter: contrast(0.8);
  height: 600px;
  width: auto;
}

#videoControles {
  border-radius: 10px;
}
</style>