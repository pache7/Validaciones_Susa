// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path:'/inicio',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Inicio',
        component: () => import('@/views/Inicio.vue'),
      },
    ],
  },
  {
    path:'/mapa',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Mapa',
        component: () => import('@/views/Mapa.vue'),
      },
    ],
  },
  {
    path:'/descargar',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Descargar',
        component: () => import('@/views/Descargar.vue'),
      },
    ],
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
