<template>
  <div>
    <h1>Soy el Mapa</h1>
    <div id="mapContainer"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet.markercluster";
import axios from "axios";

export default {
  name: "Map",
  mounted() {
    const map = L.map("mapContainer").setView([-27.36708, -55.89608], 14);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const markers = L.markerClusterGroup(); // Utiliza el grupo de clústeres de marcadores

    let originalMarkers = []; // Almacena los marcadores originales

    axios
      .get("2023 06 - jun/20230601.json")
      .then((response) => {
        const jsonData = response.data;
        console.log(jsonData);
        jsonData.forEach((item) => {
          const latitud = item.latitud;
          const longitud = item.longitud;
          const linea = item.linea;
          const hora = item.hora;

          const marker = L.marker([latitud, longitud]);
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
};
</script>

<style scoped>
#mapContainer {
  height: 400px;
}
</style>
