import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import App from './App.vue'
import 'uno.css'
import './styles/index.scss'
import { setupRoute } from './router'
import { setupDirective } from './core/directives'
import { setupPinia } from './store'

const app = createApp(App)
setupPinia(app)
setupRoute(app)
setupDirective(app)
app.use(ElementPlus)

app.mount('#app')
