// src/main.ts
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './assets/main.css' // Tailwind aqui, DEPOIS do Vuetify

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.mount('#app')
