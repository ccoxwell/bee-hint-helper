import { createApp } from 'vue'
import App from './App.vue'

// import './assets/main.css'

// import 'vuetify/styles'
// import { createVuetify } from 'vuetify'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'
// import { md3 } from 'vuetify/blueprints'

// const vuetify = createVuetify({
//   components,
//   directives,
//   blueprint: md3,
//   theme: {
//     defaultTheme: 'light',
//   },
// })

const app = createApp(App)

// app.use(vuetify)
app.mount('#app')
