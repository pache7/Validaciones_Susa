<template>
    <div class="text-center">
      <v-progress-circular
        v-if="showProgress"  
        :rotate="360"
        :size="100"
        :width="15"
        :model-value="value"
        color="teal"
      >
        <template v-slot:default> {{ value }} % </template>
      </v-progress-circular>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        interval: -1,
        value: 0,
        showProgress: false,  // Inicialmente, oculta la barra de progreso
      };
    },
    props:['progress'],
    mounted() {
      // Iniciar tu proceso aquí
      this.startProcess();
    },
    beforeUnmount() {
      clearInterval(this.interval);
    },
    methods: {
      startProcess() {
        this.showProgress = true;  // Muestra la barra de progreso al iniciar el proceso
        this.interval = setInterval(() => {
          if (this.value === 100) {
            clearInterval(this.interval);
            this.showProgress = false;  // Oculta la barra de progreso al finalizar el proceso
            return;
          }
          this.value += 10;
        }, 1000);
      },
    },
  };
  </script>
  
  <style scoped>
  .v-progress-circular {
    margin: 1rem;
  }
  </style>
  