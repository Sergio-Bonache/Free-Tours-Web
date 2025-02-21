<script setup>
import { ref, onMounted } from "vue";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
</script>
<template>
    <div class="container mt-5 mb-5">
        <h2 class="mb-4">Crear Ruta</h2>
        <div class="card shadow bg-light">
            <div class="card-body">
                <form>
                    <!-- Título y Localidad -->
                    <div class="row mb-3">
                        <div class="col">
                            <label for="titulo" class="form-label">Título</label>
                            <input type="text" class="form-control" id="titulo" placeholder="Ingrese el título" />
                        </div>
                        <div class="col">
                            <label for="localidad" class="form-label">Localidad</label>
                            <input type="text" class="form-control" id="localidad" placeholder="Ingrese la localidad" />
                        </div>
                    </div>

                    <!-- Descripción -->
                    <div class="mb-3">
                        <label for="descripcion" class="form-label">Descripción</label>
                        <textarea class="form-control" id="descripcion" rows="3" placeholder="Ingrese la descripción"
                            style="resize: none;"></textarea>
                    </div>

                    <!-- URL de la imagen -->
                    <div class="mb-3">
                        <label for="imagenUrl" class="form-label">URL de la imagen</label>
                        <input type="text" class="form-control" id="imagenUrl"
                            placeholder="Ingrese la URL de la imagen" />
                    </div>

                    <!-- Fecha y Hora -->
                    <div class="row mb-3">
                        <div class="col">
                            <label for="fecha" class="form-label">Fecha</label>
                            <input type="date" class="form-control" id="fecha" />
                        </div>
                        <div class="col">
                            <label for="hora" class="form-label">Hora</label>
                            <input type="time" class="form-control" id="hora" />
                        </div>
                    </div>

                    <!-- Guía -->
                    <div class="mb-3">
                        <label for="guia" class="form-label">Guía</label>
                        <select class="form-select" id="guia">
                            <option selected disabled>Seleccione un guía</option>
                            <option value="1">Guía 1</option>
                            <option value="2">Guía 2</option>
                            <option value="3">Guía 3</option>
                        </select>
                    </div>

                    <!-- Latitud y Longitud -->
                    <div class="row mb-3">
                        <div class="col">
                            <label for="latitud" class="form-label">Latitud</label>
                            <input type="text" class="form-control" id="latitud" placeholder="Ingrese la latitud" />
                        </div>
                        <div class="col">
                            <label for="longitud" class="form-label">Longitud</label>
                            <input type="text" class="form-control" id="longitud" placeholder="Ingrese la longitud" />
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <button type="submit" class="btn btn-success w-100">Crear Ruta</button>
                        </div>
                        <div class="col">
                            <button type="submit" class="btn btn-danger w-100">Vaciar formulario</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
