<template>
  <div class="app">

    <div class="container">
      <RouterView />
    </div>
    <div class="Mapa">
      <Mapa />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import Mapa from "./components/Map.vue";

export default {
  setup() {
    const tab = ref(null);
    return {
      tab,
    };
  },
  components: {
    Mapa,
  },
};
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.Mapa {
  width: 95%;
  height: 400px; /* Ajusta la altura según tus necesidades */
  margin-top: 20px; /* Ajusta el margen según tus necesidades */
}
</style>