import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'vue-cropper/dist/index.css'
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

app.mount('#app')
