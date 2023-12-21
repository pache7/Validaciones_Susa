<template>
    <v-container class="fill-height">
        <v-row class="d-flex align-center justify-center">
            <v-col cols="auto">
                <div class="image">
                    <v-img height="150" src="@/assets/logomu-gris.webp" />
                </div>
               
                <v-card class="mx-auto" width="500" height="400" color="indigo" variant="outlined">
                    <template v-slot:title>
                        <v-icon icon="mdi mdi-bus-marker" size="large" /> Validaciones SUSA
                    </template>

                    <v-card-text>
                        <v-sheet width="400" class="mx-auto">
                            <v-form fast-fail @submit.prevent>
                                <v-text-field v-model="firstName" label="Usuario" :rules="firstNameRules"></v-text-field>

                                <v-text-field v-model="lastName" label="Password" :rules="lastNameRules"></v-text-field>

                                <v-btn type="submit" block class="mt-2" color="indigo"> Ingresar </v-btn>
                            </v-form>
                        </v-sheet>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn variant="text" color="teal-accent-4" @click="reveal = true">
                            Registrarse
                        </v-btn>
                    </v-card-actions>

                    <v-expand-transition>
                        <v-card v-if="reveal" class="v-card--reveal" style="height: 100%;">
                            <v-card-text class="pb-0">
                                <Register />
                            </v-card-text>
                            <v-card-actions class="pt-0">
                                <v-btn variant="text" color="teal-accent-4" @click="reveal = false">
                                    Cerrar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-expand-transition>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Register from './Register.vue'


export default {
    components: { Register },
    data: () => ({
        firstName: '',
        firstNameRules: [
            value => {
                if (value?.length > 3) return true

                return 'First name must be at least 3 characters.'
            },
        ],
        lastName: '',
        lastNameRules: [
            value => {
                if (/[^0-9]/.test(value)) return true

                return 'Last name can not contain digits.'
            },
        ],
        reveal: false,
    }),
}
</script>

<style scoped>
.v-card--reveal {
    bottom: 0;
    opacity: 1 !important;
    position: absolute;
    width: 100%;
}
.image{
    margin-bottom: 10px;
}
</style>