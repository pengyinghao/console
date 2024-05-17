import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { createRouterGuard } from './guard'
import { routes } from './routes'
import { eventEmitter } from '@/utils/eventEmitter'
import { useUserStore } from '@/store'

const router = createRouter({
    routes,
    history: createWebHistory(),
    scrollBehavior() {
        return {
            top: 0,
            behavior: 'smooth'
        }
    }
})

eventEmitter.on('API:UN_AUTH', (response) => {
    ElMessageBox.alert(response.message, '提示', {
        callback: () => {
            useUserStore().loginOut()
            router.replace('/login')
        }
    })
})

export default router
export function setupRoute(app: App) {
    app.use(router)
    createRouterGuard(router)
}
