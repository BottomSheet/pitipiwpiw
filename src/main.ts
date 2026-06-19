import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')

// Заставляем Safari свернуть адресную строку
window.addEventListener('load', () => {
  setTimeout(() => window.scrollTo(0, 1), 50)
})