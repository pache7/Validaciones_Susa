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
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import axios from "axios";
import Calendario from "./Calendario.vue";

export default {
  name: "Map",
  components: {
    Calendario,
  },
  data: () => ({
    name: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
    selectedDate: null,
    dateFormat: "yyyy-MM-dd",
    selectedLine: null,
    Horario: null,
    mapa: null,
    original_mrkt: [],
    mrkt_group: null,
    lineas_encontradas: [{ text: "Linea", value: 0 }],
    horarios: [{}],
  }),
  mounted() {
    const map = L.map("mapContainer").setView([-27.36708, -55.89608], 14);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    this.mapa = map;

    axios
      .get("2023 06 - jun/20230603.json")
      .then((response) => {
        const jsonData = response.data;
        const mrk_group = L.markerClusterGroup();
        let originalMarkers = []; // Almacena los marcadores originales

        console.log(jsonData);

        jsonData.forEach((item) => {
          let linea = item.linea;
          let hora = item.hora;

          console.log(linea);

          let marker = L.marker([item.latitud, item.longitud]);
          marker.bindPopup(
            `<b>Linea:${linea}</b> <br> Hora:${hora} <br>Tarjeta: ${item.tipo_tarjeta}`
          );
          originalMarkers.push(marker);
          mrk_group.addLayer(marker);

          this.loadArray(item);
        });

        this.lineas_encontradas.sort((a, b) => a.text.localeCompare(b.text));

        map.addLayer(mrk_group);
        this.mapa.addLayer(mrk_group);

        this.original_mrkt = originalMarkers;
        this.mrkt_group = mrk_group;

        // Guarda una referencia al componente para usar dentro del evento 'moveend'
        const self = this;

        map.on("moveend", () => {
          // Obtiene la línea seleccionada actualmente
          const lineaSeleccionada = parseInt(self.selectedLine);

          if (lineaSeleccionada) {
            // Filtra los marcadores originales y muestra solo aquellos que pertenecen a la línea seleccionada
            const visibleMarkers = self.original_mrkt.filter((marker) => {
              const item = marker.getPopup().getContent();
              const lineaValue = parseInt(
                item.match(/<b>Linea:(.*?)<\/b>/)[1].trim()
              );
              return lineaValue === lineaSeleccionada;
            });

            // Elimina todos los marcadores del grupo de clústeres y agrega los marcadores filtrados
            self.mrkt_group.clearLayers();
            self.mrkt_group.addLayers(visibleMarkers);
          } else {
            // Si no hay línea seleccionada, mostramos todos los marcadores originales
            self.mrkt_group.clearLayers();
            self.mrkt_group.addLayers(self.original_mrkt);
          }
        });
      })
      .catch((error) => {
        console.error("Error al obtener los datos JSON:", error);
      });
  },
  methods: {
    loadArray(item) {
      const lineaValue = item.linea;
      const horaValue = item.hora;

      const exists = this.lineas_encontradas.some(
        (item) => item.value === lineaValue
      );
      const exists2 = this.horarios.some((hora) => hora.value === horaValue);

      if (!exists) {
        this.lineas_encontradas.push({
          text: `Linea ${lineaValue}`,
          value: lineaValue,
        });
      }

      if (!exists2) {
        this.horarios.push({ text: `Horario ${horaValue}`, value: horaValue });
      }
    },
    FiltrarLinea() {
      console.log(`Linea Seleccionada ${this.selectedLine}`);
      if (this.selectedLine) {
        const lineaSeleccionada = parseInt(this.selectedLine);

        const visibleMarkers = this.original_mrkt.filter((marker) => {
          const item = marker.getPopup().getContent();
          const lineaValue = parseInt(
            item.match(/<b>Linea:(.*?)<\/b>/)[1].trim()
          );

          return lineaValue === lineaSeleccionada;
        });

        this.mrkt_group.clearLayers();
        this.mrkt_group.addLayers(visibleMarkers);
      } else {
        // Si no hay línea seleccionada, mostramos todos los marcadores originales
        this.mrkt_group.clearLayers();
        this.mrkt_group.addLayers(this.original_mrkt);
      }
    },
  },
};
</script>

<style scoped>
#mapContainer {
  height: 1000px;
}
</style>
