<template>
    <div class="form-floating">
      <input type="date" class="form-control" v-model="startDate" @input="validateDates">
      <input type="date" class="form-control" v-model="endDate" @input="validateDates">
      <label for="startDate">Seleccionar Rango de Fechas</label>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        startDate: '',
        endDate: '',
      };
    },
    methods: {
      validateDates() {
        if (this.startDate && this.endDate && this.startDate > this.endDate) {
          // Si la fecha de inicio es posterior a la fecha de fin, cámbialas.
          const temp = this.startDate;
          this.startDate = this.endDate;
          this.endDate = temp;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos CSS personalizados para el componente DateRangePicker */
  </style>
  