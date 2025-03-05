//@ts-ignore
import App from './App.vue'

import vuetify from './plugins/vuetify'
import router from './plugins/router'
import { createApp } from 'vue'



createApp(App)
.use(vuetify)
.use(router)
.mount('#app')
