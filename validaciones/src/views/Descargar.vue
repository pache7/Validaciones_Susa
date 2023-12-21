<template>
  <v-container class="fill-height">
    <v-row class="d-flex align-center justify-center">
      <v-col cols="auto">
        <v-card v-if="!showModal" class="mx-auto" color="indigo" width="500">
          <v-toolbar flat color="indigo">
            <v-btn icon="mdi mdi-database-arrow-down"></v-btn>
            <v-toolbar-title class="font-weight-light">Validaciones BD</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="isEditing = !isEditing">
              <v-fade-transition leave-absolute>
                <v-icon v-if="isEditing">mdi-close</v-icon>
                <v-icon v-else>mdi-pencil</v-icon>
              </v-fade-transition>
            </v-btn>
          </v-toolbar>

          <v-card-text>
            <v-text-field v-model="selectedDate" :disabled="!isEditing" base-color="white" label="Fecha_Validación"
              type="date"></v-text-field>
            <v-autocomplete v-model="selectedState" :disabled="!isEditing" :items="states" :custom-filter="customFilter"
              base-color="white" item-title="name" item-value="abbr" label="Tipo_Validación"></v-autocomplete>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!isEditing" @click="save">Descargar</v-btn>
          </v-card-actions>

          <v-snackbar v-model="hasSaved" :timeout="2000" attach position="absolute" location="bottom left">
            Los datos fueron descargados exitosamente!
          </v-snackbar>
        </v-card>
        <v-dialog v-if="showModal" v-model="showModal" max-width="800">
          <v-card>
            <v-card-title>Tabla de Datos
              <v-spacer></v-spacer>

              <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" density="compact" label="Search" single-line
                flat hide-details variant="solo-filled"></v-text-field>
            </v-card-title>
            <v-card-text>
              <v-data-table v-model:search="search" :items="datos" :headers="headers" :items-per-page="10"
                class="elevation-1">
                <template v-slot:top>
                  <v-toolbar flat color="white">
                    <v-toolbar-title>Información Detallada {{ fechaAnterior }}</v-toolbar-title>
                  </v-toolbar>
                </template>
              </v-data-table>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="showModal = false">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import axios from 'axios';
import { saveAs } from 'file-saver';

export default {
  data: () => ({
    hasSaved: false,
    isEditing: null,
    selectedState: null,
    selectedDate: null,
    fechaAnterior: null,
    search: '',
    states: [
      { name: 'Validaciones', abbr: 'FL', id: 1 },
      { name: 'Qr', abbr: 'Qr', id: 2 },
      { name: 'Tipo Pasajero', abbr: 'NE', id: 3 },
      { name: 'Kilometros por Linea', abbr: 'CA', id: 4 },

    ],
    datos: [],
    headers: [
      { title: 'Hora', text: 'Hora', value: 'hora' },
      { title: 'Interno', text: 'Interno', value: 'interno' },
      { title: 'Linea', text: 'Línea', value: 'linea' },
      { title: 'Ramal', text: 'Ramal', value: 'ramal' },
      { title: 'Tipo_Validacion', text: 'Tipo', value: 'tipo' },
      { title: 'Boleto', text: 'Tipo de Tarjeta', value: 'tipo_tarjeta' },
      { title: 'Zona', text: 'Zona', value: 'zona' },
    ],
    showModal: false,
  }),

  methods: {
    customFilter(itemTitle, queryText, item) {
      const textOne = item.raw.name.toLowerCase()
      const textTwo = item.raw.abbr.toLowerCase()
      const searchText = queryText.toLowerCase()

      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1
    },
    save() {
      const loginData = {
        "user": "movilidad@gmail.com",
        "password": "hw3ysunn4wnnCxhQR6wd"
      }

      axios({
        method: 'POST',
        url: 'http://gob.servicios-urbanos.com.ar:2000/api/v1/auth/entities',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        data: loginData,
      }).then((response) => {
        if (response.status === 200) {

          const token = response.data.token;
          console.log(this.selectedState)
          if (this.selectedState === 'Qr') {

            this.fechaAnterior = this.formatDate(this.selectedDate);
            console.log(this.fechaAnterior);

            axios({
              method: 'GET',
              url: `http://gob.servicios-urbanos.com.ar:2000/api/v1/validaciones?fecha=${this.fechaAnterior}`,
              headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'SERVICIOS-URBANOS-TOKEN': `${token}`,
              },
            }).then((res) => {
              const data = res.data.data;
              this.datos = data 

              const jsonData = JSON.stringify(data,null,2);

              const blob = new Blob([jsonData],{type:'application/json'});

              console.log(blob);

              saveAs(blob,`qr_${this.fechaAnterior}.json`);

              console.log('Archivo JSON descargado correctamente.');

            });
          }

        }
      });

      this.isEditing = !this.isEditing;
      this.hasSaved = true;
      this.showModal = true;
    },

    formatDate(date) {
      const [year, month, day] = date.split('-');
      return `${year}/${month}/${day}`;
    },

  },
}
</script>