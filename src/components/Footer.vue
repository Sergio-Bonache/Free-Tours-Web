<template>
  <footer class="py-3 mt-auto">
    <div class="container">
      <div class="row">
        <h3 class="text-decoration-underline text-center"><img src="../assets/images/palmera-fondo-verde.png" alt="logo"
            height="38"> Viajes Quinto Pino</h3>
        <div class="col-md-3 mb-3 initialBox">
          <h4 class="fst-italic">Contacto</h4>
          <ul class="list-unstyled">
            <li><img src="../assets/images/mail.png" alt="Sobre" height="30" class="me-2">quintopino@contact.com</li>
            <li><img src="../assets/images/phone.png" alt="Telefono" height="30" class="me-2"> +34 656 45 45 45</li>
          </ul>
        </div>
        <div class="col-md-3 mb-3">
          <h4 class="fst-italic">Síguenos</h4>
          <ul class="list-unstyled">
            <li><img src="../assets/images/instagram.png" alt="Instagram" height="30" class="me-2">Instagram</li>
            <li><img src="../assets/images/x.png" alt="X" height="30" class="me-2">X</li>
            <li><img src="../assets/images/youtube.png" alt="Youtube" height="30" class="me-2">Youtube</li>
            <li><img src="../assets/images/facebook.png" alt="Facebook" height="30" class="me-2">Facebook</li>
          </ul>
        </div>
        <div class="col-md-3 mb-3">
          <h4 class="fst-italic">Más...</h4>
          <ul class="list-unstyled">
            <li><img src="../assets/images/book.png" alt="Libro" height="30" class="me-2">Nuestra Historia</li>
            <li><img src="../assets/images/security.png" alt="Seguridad" height="30" class="me-2">Seguridad y
              Privacidad</li>
          </ul>
        </div>
      </div>
    </div>
    <hr />
    <div class="text-center mt-4 pt-2">
      <p xmlns:cc="http://creativecommons.org/ns#">This work is licensed under <a
          href="https://creativecommons.org/licenses/by-nc-nd/4.0/?ref=chooser-v1" target="_blank"
          rel="license noopener noreferrer" style="display:inline-block;">CC BY-NC-ND 4.0<img
            style="height:22px!important;margin-left:3px;vertical-align:text-bottom;"
            src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt=""><img
            style="height:22px!important;margin-left:3px;vertical-align:text-bottom;"
            src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt=""><img
            style="height:22px!important;margin-left:3px;vertical-align:text-bottom;"
            src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1" alt=""><img
            style="height:22px!important;margin-left:3px;vertical-align:text-bottom;"
            src="https://mirrors.creativecommons.org/presskit/icons/nd.svg?ref=chooser-v1" alt=""></a></p>
      <p>&copy; {{ new Date().getFullYear() }} - Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<style>
footer {
  background-color: #EEEEEE;
}

.initialBox {
  margin-left: 21%;
}
</style>