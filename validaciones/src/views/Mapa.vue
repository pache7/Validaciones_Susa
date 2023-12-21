<template>
  <v-container class="fill-height">
    <v-sheet class="mx-auto" :height="1000" :width="1000">
      <form>
        <div class="row g-2">
          <div class="col-md">
            <div class="form-floating">

              <select id="inputLine" class="form-select" v-model="selectedLine">
                <option value="" disabled selected>Seleccione una Línea...</option>
                <option v-for="linea in lineas" :key="linea" :value="linea">{{ linea }}</option>
              </select>

              <label for="inputLine">Seleccionar Linea</label>
            </div>
          </div>

          <div class="col-md">
            <div class="form-floating">

              <select id="inputHora" class="form-select" v-model="selectedHora">
                <option value="" disabled selected>Seleccione una Hora...</option>
                <option v-for="hora in horas" :key="hora" :value="hora">{{ hora }}</option>
              </select>

              <label for="inputHora">Seleccionar Horario</label>
            </div>
          </div>
          
          <div class="col-md">
            <div class="form-floating">

              <select id="inputInterno" class="form-select" v-model="selectedInterno">
                <option value="" disabled selected>Seleccione un Interno...</option>
                <option v-for="interno in internos" :key="interno" :value="interno">{{ interno }}</option>
              </select>

              <label for="inputInterno">Seleccionar Interno</label>
            </div>
          </div>

        </div>
        <br>
        <div class="row g-2">
          <!-- col 1 -->
          <div class="col-md">
            <div class="form-floating">
              <input type="date" class="form-control" id="floatingInputGrid" v-model="selectedDate">
              <label for="floatingInputGrid"> Fecha Inicial </label>
            </div>
            <div class="form-floating">
              <input type="date" class="form-control" id="floatingInputGrid2" v-model="lastSelectedDate">
              <label for="floatingInputGrid2"> Fecha Final </label>
            </div>
          </div>
          <!-- col 2 -->
          <div class="col-md">
            <div class="form-floating">
              <select id="inputBoleto" class="form-select" v-model="selectedBoleto">
                <option value="" disabled selected>Seleccione un Boleto...</option>
                <option v-for="boleto in boletos" :key="boleto" :value="boleto">{{ boleto }}</option>
              </select>
              <label for="inputBoleto">Seleccionar Boleto</label>
            </div>
          </div>
          <!-- col 3 -->
          <div class="col-md">
            <div class="form-floating">
              <select id="inputBoleto" class="form-select" v-model="selectedRamal">
                <option value="" disabled selected>Seleccione un Ramal...</option>
                <option v-for="ramal in ramales" :key="ramal" :value="ramal">{{ ramal }}</option>
              </select>
              <label for="inputBoleto">Seleccionar Ramal</label>
            </div>
          </div>
        </div>
        <br>
        <div class="row g-2">

          <v-container>
            <v-row justify="center" align="center">
              <v-col cols="auto">
                <v-btn
                    class="ma-2"
                    color="primary" size="large" @click="initializeMap"
                  >
                    Validar
                    <v-icon
                      end
                      icon="mdi mdi-map-marker-radius"
                    ></v-icon>
                  </v-btn>
              </v-col>

              <v-col cols="auto">

                <v-btn
                    class="ma-2"
                    color="red" size="large" @click="resetForm"
                  >
                    Borrar
                    <v-icon
                      end
                      icon="mdi mdi-delete"
                    ></v-icon>
                  </v-btn>
              </v-col>

              <v-col cols="auto">

                <Modal :array_validaciones="validaciones_obj" />
                
              </v-col>
            </v-row>
          </v-container>

        </div>
      </form>
      <br>
      <div id="mapContainer"></div>
    </v-sheet>
  </v-container>
</template>

<script>
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import axios from "axios";
import Modal from "../components/Modal.vue";

export default {
  name: "Map",
  components: {
    Modal
  },
  data: () => ({
    name: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
    ],

    selectedLine: '',
    selectedDate: new Date().toISOString().substr(0, 10),
    lastSelectedDate: new Date().toISOString().substr(0, 10),
    selectedHora: '',
    selectedBoleto: '',
    selectedRamal: '',
    selectedInterno: '',
    lineas: [],
    horas: [],
    boletos: [],
    ramales: [],
    validaciones: [],
    validaciones_obj: [],
    internos: [],
    totalElements: 0, // Número total de elementos a procesar
    elementsProcessed: 0, // Número de elementos procesados // Valor de progreso de la barra
    progress: 0,
    interval: {},
    suma:0,
  }),


  methods: {
    async initializeMap() {
      var map = L.map("mapContainer").setView([-27.36708, -55.89608], 14);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);


      var markers = L.markerClusterGroup(); // Utiliza el grupo de clústeres de marcadores

      let originalMarkers = []; // Almacena los marcadores originales

      const year = this.selectedDate.substr(0, 4);
      const month = this.selectedDate.substr(5, 2);
      const day = this.selectedDate.substr(8, 2);
      const monthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
      const monthAbbreviation = monthNames[parseInt(month) - 1];

      let jsonFileName = `${year} ${month} - ${monthAbbreviation}/${year}${month}${day}.json`;

      const dayf = this.lastSelectedDate.substr(8, 2);

      let currentDay = parseInt(day);
      const endDay = parseInt(dayf);

      while (currentDay <= endDay) {

        await axios
          .get(`data/${jsonFileName}`)
          .then((response) => {
            var jsonData = response.data;
            this.validaciones.push(jsonData)

          })
          .catch((error) => {
            console.error("Error al obtener los datos JSON:", error);
          });

        currentDay++;
        if (currentDay <= 9) {
          jsonFileName = `${year} ${month} - ${monthAbbreviation}/${year}${month}${0}${currentDay}.json`;
        } else {
          jsonFileName = `${year} ${month} - ${monthAbbreviation}/${year}${month}${currentDay}.json`;
        }

      }


      const lineasSet = new Set();
      const HoraSet = new Set();
      const Boleto = new Set();
      const Ramal = new Set();
      const InternoSet = new Set();

      this.totalElements = this.validaciones.reduce((acc, elem) => acc + elem.length, 0);

      this.validaciones.forEach((elem) => {

        elem.forEach((validacion) => {

          let latitud = validacion.latitud;
          let longitud = validacion.longitud;
          let linea = validacion.linea;
          let hora = validacion.hora;
          let fecha = validacion.fecha
          let tarjeta = validacion.tipo_tarjeta
          let tipo_ramal = validacion.ramal
          let Interno = validacion.interno

          lineasSet.add(linea);
          HoraSet.add(hora);
          Boleto.add(tarjeta);
          Ramal.add(tipo_ramal);
          InternoSet.add(Interno);

          var marker = L.marker(new L.LatLng(latitud, longitud), {
            linea: linea,
            hora: hora,
            fecha: fecha,
            boleto: tarjeta,
            ramal: tipo_ramal,
            interno: Interno
          });

          marker.bindPopup(`Linea: <b>${linea}</b><br> Hora: <b>${hora}</b><br> Boleto: <b>${tarjeta}</b>
            <br>Fecha: <b>${fecha}</b><br>Ramal: <b>${tipo_ramal}</b><br>Interno: <b>${Interno}</b>`); // Agrega el popup al marcador
          originalMarkers.push(marker); // Agrega el marcador a la lista de marcadores originales
          markers.addLayer(marker); // Agrega el marcador al grupo de clústeres


          map.addLayer(markers); // Añade el grupo de clústeres al mapa

          this.lineas = Array.from(lineasSet).sort((a, b) => a - b);
          this.horas = Array.from(HoraSet).sort((a, b) => a - b);
          this.boletos = Array.from(Boleto).sort((a, b) => a - b);
          this.ramales = Array.from(Ramal).sort((a, b) => a - b);
          this.internos = Array.from(InternoSet).sort((a, b) => a - b);
  
          this.elementsProcessed++;
          this.progress = (this.elementsProcessed / this.totalElements) * 100;
          console.log(this.progress);


        }) //final elementos
  

      }) //final validaciones

      this.validaciones_obj = this.validaciones;

      map.on("moveend", () => {
        // Actualiza los marcadores visibles cuando el usuario se desplace o haga zoom
        const visibleMarkers = originalMarkers.filter((marker) => {
          return (
            map.getBounds().contains(marker.getLatLng()) &&
            (!this.selectedLine || marker.options.linea === this.selectedLine) &&
            (!this.selectedHora || marker.options.hora === this.selectedHora) &&
            (!this.selectedBoleto || marker.options.boleto === this.selectedBoleto) &&
            (!this.selectedRamal || marker.options.ramal === this.selectedRamal)
          );
        });

        markers.clearLayers(); // Elimina todos los marcadores del grupo de clústeres
        markers.addLayers(visibleMarkers); // Agrega solo los marcadores visibles al grupo de clústeres
      });

    },


    resetForm() {
      // Resetea las propiedades a sus valores iniciales
      this.selectedLine = '';
      this.selectedHora = '';
      this.selectedDate = new Date().toISOString().substr(0, 10);
      this.selectedBoleto = '';

      // Recarga la página
      window.location.reload();
    },
  }
};
</script>

<style scoped>
#mapContainer {
  height: 500px;
}



</style> 


