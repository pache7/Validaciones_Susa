<template>
  <div>
    <div class="text-center">
      <form class="row g-3">
        <div class="col-md-6">
          <label for="inputCity" class="form-label">
            Horario de Recorrido
          </label>
          <select id="inputState" class="form-select" v-model="Horario">
            <option value="" disabled selected>Choose...</option>
            <option
              v-for="hora in horarios"
              :key="hora.value"
              :value="hora.value"
            >
              {{ hora.text }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <label for="inputState" class="form-label"> Lineas </label>
          <select id="inputState" class="form-select" v-model="selectedLine">
            <option value="" disabled selected>Choose...</option>
            <option
              v-for="linea in lineas_encontradas"
              :key="linea.value"
              :value="linea.value"
            >
              {{ linea.text }}
            </option>
          </select>
        </div>
        <div class="col-md-2">
          <label for="inputZip" class="form-label"> Tipo de Boleto</label>
          <select id="inputZip" class="form-select">
            <option>Único</option>
            <option>Estudiantil</option>
            <option selected>...</option>
          </select>
        </div>
        <div>
          <Calendario />
        </div>
        <div class="col-12">
          <button type="button" class="btn btn-success" @click="FiltrarLinea()">
            Ver Mapa
          </button>
        </div>
      </form>
    </div>
    <div id="mapContainer"></div>
  </div>
</template>




<script>
import L from "leaflet";
import Calendario from "./Calendario.vue";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import axios from "axios";

export default {
  name: "Map",
  mounted() {
    var map = L.map("mapContainer").setView([-27.36708, -55.89608], 14);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    var markers =  L.markerClusterGroup(); // Utiliza el grupo de clústeres de marcadores

    let originalMarkers = []; // Almacena los marcadores originales

    axios
      .get("2023 06 - jun/20230602.json")
      .then((response) => {
        var jsonData = response.data;
        console.log(jsonData);
        jsonData.forEach((item) => {
          let latitud = item.latitud;
          let longitud = item.longitud;
          let linea = item.linea;
          let hora = item.hora;

          var marker = L.marker(new L.LatLng(latitud, longitud));
          marker.bindPopup(`Linea:${linea}  Hora:${hora}`); // Agrega el popup al marcador
          originalMarkers.push(marker); // Agrega el marcador a la lista de marcadores originales
          markers.addLayer(marker); // Agrega el marcador al grupo de clústeres
        });

        map.addLayer(markers); // Añade el grupo de clústeres al mapa

        map.on("moveend", () => {
          // Actualiza los marcadores visibles cuando el usuario se desplace o haga zoom
          const visibleMarkers = originalMarkers.filter((marker) => {
            return map.getBounds().contains(marker.getLatLng());
          });

          markers.clearLayers(); // Elimina todos los marcadores del grupo de clústeres

          markers.addLayers(visibleMarkers); // Agrega solo los marcadores visibles al grupo de clústeres
        });
        
      })
      .catch((error) => {
        console.error("Error al obtener los datos JSON:", error);
      });
  },
  components:{
     Calendario
  }
};
</script>

<style scoped>
#mapContainer {
  height: 400px;
}
</style>
