<template>
    <v-card
      class="mx-auto"
      max-width="500"
    >
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span>{{ currentTitle }}</span>
        <v-avatar
          color="primary"
          size="24"
          v-text="step"
        ></v-avatar>
      </v-card-title>
  
      <v-window v-model="step">
        <v-window-item :value="1">
          <v-card-text>
            <v-text-field
              label="Email"
              placeholder="john@google.com"
            ></v-text-field>
            <span class="text-caption text-grey-darken-1">
              Este es el usuario para verificar tu cuenta de Validaciones
            </span>
          </v-card-text>
        </v-window-item>
  
        <v-window-item :value="2">
          <v-card-text>
            <v-text-field
              label="Password"
              type="password"
            ></v-text-field>
            <v-text-field
              label="Confirm Password"
              type="password"
            ></v-text-field>
            <span class="text-caption text-grey-darken-1">
              Ingresar una Contraseña para tu Cuenta
            </span>
          </v-card-text>
        </v-window-item>
  
        <v-window-item :value="3">
          <div class="pa-4 text-center">

            <v-icon icon="mdi mdi-checkbox-marked-circle" size="x-large" color="green"/>

            <h3 class="text-h6 font-weight-light mb-2">
               Registro Exitoso!
            </h3>
          </div>
        </v-window-item>
      </v-window>
  
      <v-divider></v-divider>
  
      <v-card-actions>
        <v-btn
          v-if="step > 1 && step !== 3"
          variant="text"
          @click="step--"
        >
          Atrás
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="step < 3"
          color="primary"
          variant="flat"
          @click="step++"
        >
          Siguiente
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>

<script>
export default {
  data: () => ({
    step: 1,
  }),

  computed: {
    currentTitle () {
      switch (this.step) {
        case 1: return 'Usuario'
        case 2: return 'Contraseña'
        default: return 'Cuenta Registrada'
      }
    },
  },
}
</script>