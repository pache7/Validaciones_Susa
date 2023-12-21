<template>

  <v-container class="fill-height">

    <v-row justify="center">
      <v-dialog v-model="dialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
        <template v-slot:activator="{ props }">
          <v-btn class="ma-2" color="primary" dark v-bind="props" size="large" @click="verTabla">
            Tabla
            <v-icon end icon="mdi mdi-table-eye"></v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title> Tabla de Validaciones </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn variant="text" @click="dialog = false">
                Cerrar
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-data-table v-model:expanded="expanded" :headers="dessertHeaders" :items="filteredDesserts" show-expand
            class="elevation-1">
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>
                  <v-select v-model="selectedFilter" :items="filterOptions" label="Elegir el Filtro"></v-select>
                </v-toolbar-title>
              </v-toolbar>
            </template>
            <template v-slot:expanded-row="{ columns, item }">
              <tr>
                <td :colspan="columns.length">
                  Más información sobre la línea: {{ item.linea }}
                </td>
              </tr>
            </template> 
          </v-data-table>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>

</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      expanded: [],
      desserts: [],
      filterOptions: ['Por Ramal', 'Por Hora', 'Por Dia', 'Por Boleto'],
      selectedFilter: 'Por Dia',
      tipoBoletos: ['Unico', 'Universitario', 'Discapacitado', 'Ex-Combatiente', 'Escolar', 'Mayor de Edad'],
      boletoCounts: {},
      countsByLineAndRamal: {}, // Para contar por línea y ramal
    };
  },
  props: ["array_validaciones"],
  computed: {
    dessertHeaders() {
      if (this.selectedFilter === 'Por Dia') {
        const header = [
          {
            title: 'Linea',
            align: 'start',
            sortable: false,
            key: 'linea',
          },
          { title: 'Interno', key: 'interno' },
          { title: 'Hora', key: 'hora' },
          { title: 'Ramal', key: 'ramal' },
          { title: 'Boleto', key: 'tipo_tarjeta' },
          { title: '', key: 'data-table-expand' },
        ]

        return header;
      }


      if (this.selectedFilter === 'Por Boleto') {
        const headers = [
          {
            title: 'Linea',
            align: 'start',
            sortable: false,
            key: 'linea',
          },
        ];

        this.tipoBoletos.forEach((tipo) => {
          headers.push({
            title: tipo,
            key: tipo,
          });
        });


        return headers;
      }

      if (this.selectedFilter === 'Por Hora') {
          const headers = [
            {
              title: 'Hora',
              align: 'start',
              sortable: false,
              key: 'hora',
            },
            
          ];

          this.tipoBoletos.forEach((tipo) => {
            headers.push({
              title: tipo,
              key: tipo,
            });
          });


          return headers;
      }

      if (this.selectedFilter === 'Por Ramal') {
        const headers = [
            {
              title: this.selectedFilter === 'Por Ramal' ? 'Ramal' : 'Línea',
              align: 'start',
              sortable: false,
              key: this.selectedFilter === 'Por Ramal' ? 'ramal' : 'linea',
            },
          ];

          this.tipoBoletos.forEach((tipo) => {
            headers.push({
              title: tipo,
              key: tipo,
            });
          });


          return headers;
      }




    },
    filteredDesserts() {
      if (this.selectedFilter === 'Por Ramal') {
        return this.calculateCountsByRamal();
      } else if (this.selectedFilter === 'Por Boleto' || this.selectedFilter === 'Por Hora') {
        return this.calculateCantidades();
      }
      return this.desserts;
    },
  },
  methods: {
    verTabla() {
      this.desserts = this.array_validaciones.flat();
    },
    calculateCantidades() {
      // Reinicializa el objeto de recuento de boletos.
      this.boletoCounts = {};
      this.horaCounts = {};
      this.ramalCounts = {};

      // Recorre los datos y cuenta los tipos de boletos por hora.
      this.desserts.forEach((item) => {

        if (this.selectedFilter === 'Por Boleto') {
          const linea = item.linea;
          const tipoBoleto = item.tipo_tarjeta;

          if (!this.boletoCounts[linea]) {
            this.boletoCounts[linea] = {};
          }

          this.boletoCounts[linea][tipoBoleto] = (this.boletoCounts[linea][tipoBoleto] || 0) + 1;
        } else if (this.selectedFilter === 'Por Hora') {
          const hora = item.hora;
          const tipoBoleto = item.tipo_tarjeta;

          if (!this.horaCounts[hora]) {
            this.horaCounts[hora] = {
              hora: hora,
            };
          }

          if (!this.horaCounts[hora][tipoBoleto]) {
            this.horaCounts[hora][tipoBoleto] = 0;
          }

          this.horaCounts[hora][tipoBoleto]++;
        }

      });

      // Forma los datos para mostrar en la tabla.
      const dataToShow = [];

      if (this.selectedFilter === 'Por Boleto') {
        for (const linea in this.boletoCounts) {
          if (Object.hasOwnProperty.call(this.boletoCounts, linea)) {
            const rowData = {
              linea,
            };

            for (const tipo in this.boletoCounts[linea]) {
              if (Object.hasOwnProperty.call(this.boletoCounts[linea], tipo)) {
                rowData[tipo] = this.boletoCounts[linea][tipo];
              }
            }

            dataToShow.push(rowData);
          }
        }
      } else if (this.selectedFilter === 'Por Hora') {
        for (const hora in this.horaCounts) {
          if (Object.hasOwnProperty.call(this.horaCounts, hora)) {
            dataToShow.push(this.horaCounts[hora]);
          }
        }
      }

      return dataToShow;
    },
    calculateCountsByRamal() {
      // Reinicializa el objeto de recuento por línea y ramal
      this.countsByLineAndRamal = {};

      // Recorre los datos y cuenta los tipos de boletos por línea y ramal
      this.desserts.forEach((item) => {
        const key = `${item.linea} - ${item.ramal}`;

        if (!this.countsByLineAndRamal[key]) {
          this.countsByLineAndRamal[key] = {};
        }

        const tipoBoleto = item.tipo_tarjeta;

        this.countsByLineAndRamal[key][tipoBoleto] = (this.countsByLineAndRamal[key][tipoBoleto] || 0) + 1;
      });

      // Forma los datos para mostrar en la tabla
      const dataToShow = [];

      for (const key in this.countsByLineAndRamal) {
        if (Object.hasOwnProperty.call(this.countsByLineAndRamal, key)) {
          const rowData = {
            [this.selectedFilter === 'Por Ramal' ? 'ramal' : 'linea']: key,
          };

          for (const tipo in this.countsByLineAndRamal[key]) {
            if (Object.hasOwnProperty.call(this.countsByLineAndRamal[key], tipo)) {
              rowData[tipo] = this.countsByLineAndRamal[key][tipo];
            }
          }

          dataToShow.push(rowData);
        }
      }

      return dataToShow;
    },

  },
};
</script>