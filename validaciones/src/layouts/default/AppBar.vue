<template>
  <v-app-bar color="primary" density="compact">
    <v-app-bar-nav-icon variant="text" @click="toggleDrawer"></v-app-bar-nav-icon>
    <v-app-bar-title>Validaciones</v-app-bar-title>
    <template v-slot:append>
      <v-icon icon="mdi mdi-logout" size="x-large"></v-icon>
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" temporary>
    <template v-slot:prepend>
          <v-list-item
            lines="two"
            title="Usuario"
            subtitle="Sesión Activa"
          ></v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-radio-group label="Menú" v-model="radios" @change="changeRoute">
            <v-radio label="Tabla de Datos" value="tabla"></v-radio>
            <v-radio label="Validaciones Mapa" value="mapa"></v-radio>
            <v-radio label="Descargar Validaciones" value="descargar"></v-radio>
            <v-radio label="Kilometros por Linea" value="kilometro"></v-radio>
            <v-radio label="Pasajeros Activos" value="pasajero"></v-radio>
          </v-radio-group>
        </v-list>
    </v-navigation-drawer>

</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      radios: '',
    };
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    changeRoute() {
      this.$router.push(this.radios);
    },
  },
};
</script>
