<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Banner from '../components/Banner.vue';

let preguntas = [
  {
    id: "One",
    titulo: "¿Qué es un free tour?",
    respuesta: "Un free tour es una visita guiada en la que no se paga un precio fijo, sino que los participantes pueden dar una propina al guía al final del recorrido según lo que consideren adecuado. Es una opción popular para explorar una ciudad con guías locales expertos."
  },
  {
    id: "Two",
    titulo: "¿Cuánto dura un free tour?",
    respuesta: "La duración de un free tour suele ser de entre 2 y 3 horas, dependiendo de la ciudad y el recorrido. Algunos tours pueden ser más cortos o más largos, pero en general, ofrecen una exploración básica de los puntos más importantes de la ciudad."
  },
  {
    id: "Three",
    titulo: "¿Quiénes son los guías?",
    respuesta: "Los guías de un free tour suelen ser personas locales con conocimientos sobre la historia, cultura y los puntos turísticos de la ciudad. Pueden ser guías profesionales o aficionados apasionados por compartir su conocimiento con los turistas."
  },
  {
    id: "Four",
    titulo: "¿Cuánto cuesta hacer un free tour?",
    respuesta: "El precio de un free tour es flexible, ya que no se cobra una tarifa fija. Al final del tour, los participantes pueden decidir cuánto quieren dar como propina al guía, dependiendo de su satisfacción con la experiencia."
  },
]

const videoRef = ref(null);
const isPlaying = ref(false);
const isMuted = ref(false);

const updatePlayingState = () => {
  if (videoRef.value) {
    isPlaying.value = !videoRef.value.paused;
  }
};

const playPauseToggle = () => {
  if (videoRef.value) {
    if (videoRef.value.paused) {
      videoRef.value.play();
    } else {
      videoRef.value.pause();
    }
  }
};

const restartVideo = () => {
  if (videoRef.value) {
    videoRef.value.currentTime = 0;
    videoRef.value.play();
  }
};

const skipForward = () => {
  if (videoRef.value) {
    videoRef.value.currentTime += 5;
  }
};

const skipBackward = () => {
  if (videoRef.value) {
    videoRef.value.currentTime -= 5;
  }
};

const volumeUp = () => {
  if (videoRef.value) {
    videoRef.value.volume = Math.min(videoRef.value.volume + 0.1, 1);
  }
};

const volumeDown = () => {
  if (videoRef.value) {
    videoRef.value.volume = Math.max(videoRef.value.volume - 0.1, 0);
  }
};

const toggleMute = () => {
  if (videoRef.value) {
    videoRef.value.muted = !videoRef.value.muted;
    isMuted.value = videoRef.value.muted;
  }
};

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.addEventListener('play', updatePlayingState);
    videoRef.value.addEventListener('pause', updatePlayingState);
  }
});

onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.removeEventListener('play', updatePlayingState);
    videoRef.value.removeEventListener('pause', updatePlayingState);
  }
});

</script>
<template>
  <Banner/>
  <!--Quién Somos-->
  <div class="container my-5">
    <div class="container my-5">
      <div class="row align-items-center">
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
          <div class="position-relative">
            <video ref="videoRef" class="img-fluid rounded w-100">
              <source src="../assets/images/video.mp4" type="video/mp4">
              Tu navegador no soporta el elemento de video.
            </video>
            <!-- Controles superpuestos sobre el video -->
            <div class="position-absolute bottom-0 start-0 w-100 p-2">
              <div class="d-flex justify-content-center mb-2">
                <div class="btn-group me-2" role="group" aria-label="Controles de reproducción">
                  <button type="button" class="btn btn-light" @click="skipBackward">-5s</button>
                  <button type="button" class="btn btn-light" @click="playPauseToggle">
                    <span v-if="isPlaying">⏸️</span>
                    <span v-else>▶️</span>
                  </button>
                  <button type="button" class="btn btn-light" @click="skipForward">+5s</button>
                  <button type="button" class="btn btn-light" @click="restartVideo">Reiniciar</button>
                  <button type="button" class="btn btn-light" @click="volumeDown">Vol -</button>
                  <button type="button" class="btn btn-light" @click="toggleMute">
                    <span v-if="isMuted">🔇</span>
                    <span v-else>🔊</span>
                  </button>
                  <button type="button" class="btn btn-light" @click="volumeUp">Vol +</button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      <div class="carousel-item active" data-bs-interval="5000">
        <img src="../assets/images/napoles.jpg" class="d-block w-100" alt="...">
        <div class="carousel-caption d-none d-md-block">
          <h2>Napoles, Italia</h2>
        </div>
      </div>
      <div class="carousel-item" data-bs-interval="5000">
        <img src="../assets/images/lisboa.png" class="d-block w-100" alt="...">
        <div class="carousel-caption d-none d-md-block">
          <h2>Lisboa, Portugal</h2>
        </div>
      </div>
      <div class="carousel-item" data-bs-interval="5000">
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
  <!--Tarjetas Información-->
  <div class="container mt-4 mt-5">
    <div class="row text-center">
      <div class="col-sm-4">
        <div class="card">
          <div class="card-body">
            <h5 class="fs-3 text-decoration-underline">¿Por qué elegirnos?</h5>
            <p class="card-text">En Viajes Quinto Pino nos apasiona ofrecerte una experiencia única. Nos destacamos
              por la calidad de nuestros tours y el compromiso con cada viajero, asegurándonos de que cada recorrido
              sea memorable y auténtico.</p>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="card">
          <div class="card-body">
            <h5 class="fs-3 text-decoration-underline">Nuestros guías</h5>
            <p class="card-text">Nuestros guías son expertos locales, apasionados por compartir historias, cultura y
              tradiciones de la ciudad. Son personas amigables, dinámicas y siempre dispuestas a ofrecer una
              experiencia cercana y enriquecedora.</p>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="card">
          <div class="card-body">
            <h5 class="fs-3 text-decoration-underline">Sostenibilidad</h5>
            <p class="card-text">Nos importa el medio ambiente y el impacto que generamos. Promovemos prácticas
              responsables y sostenibles en todos nuestros tours para que puedas disfrutar de tu experiencia mientras
              cuidamos juntos nuestro planeta.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--Preguntas Frecuentes-->
  <div class="container mt-4 mb-5">
    <h2>Preguntas Frecuentes</h2>
    <div class="accordion mt-3" id="accordionExample">
      <div class="accordion-item" v-for="pregunta in preguntas" :key="pregunta.id">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            :data-bs-target="'#' + pregunta.id" aria-expanded="false" :aria-controls="pregunta.id">
            <img id="questionIcon" src="../assets/images/patch-question.svg">{{ pregunta.titulo }}
          </button>
        </h2>
        <div :id="pregunta.id" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            {{ pregunta.respuesta }}
          </div>
        </div>
      </div>
    </div>
  </div>


</template>


<style scoped>
img {
  filter: contrast(0.8) brightness(0.8);
  height: 600px;
  width: auto;
}

#videoControles {
  border-radius: 10px;
}

#questionIcon {
  width: 20px;
  height: auto;
  margin-right: 10px;
}

.card {
  background-color: #ececec;
}
</style>