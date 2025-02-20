<template>
    <div class="banner">
      <div class="banner-image">
        <div class="banner-title">
          <h1>Viajes Quinto Pino</h1>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Banner"
  }
  </script>
  
  <style scoped>
  .banner {
    position: relative;
    width: 100%;
    min-height: 400px; 
    height: 400px; 
    overflow: hidden;
  }
  
  .banner-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../assets/images/banner.jpeg'); 
    background-size: cover;
    background-position: center;
  }
  
  .banner-title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 3rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  </style>
  