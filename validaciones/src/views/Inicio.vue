<template>

     <v-container class="fill-height">
        <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-card
            class="mx-auto"
            width="400"
            color="black"
            variant="outlined"
          >
            <v-card-item>
              <div>
                <div class="text-overline mb-1">
                  Mapa de Validaciones
                </div>
                <div class="text-h6 mb-1">
                   <v-img alt="mapa" height="100px" src="@/assets/map-search.png"></v-img>
                </div>
                <div class="text-caption">Ubicar Validaciones en el Mapa </div>
              </div>
            </v-card-item>
  
            <v-card-actions>
              <v-btn @click="router('mapa')">
                 Ver Mapa
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="auto">
          <v-card
            class="mx-auto"
            width="400"
            color="black"
            variant="outlined"
          >
            <v-card-item>
                <div>
                <div class="text-overline mb-1">
                  Descargar Validaciones
                </div>
                <div class="text-h6 mb-1">
                   <v-img alt="mapa" height="100px" src="@/assets/database-marker.png"></v-img>
                </div>
                <div class="text-caption"> Actualizar la Base de Datos </div>
              </div>
            </v-card-item>
  
            <v-card-actions>
              <v-btn @click="router('descargar')">
                Descargar Datos
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>

  <script >
   export default {
   
    methods:{
      router(action) {
      this.$router.push(`/${action}`);
     },
    }
   }
  </script>
