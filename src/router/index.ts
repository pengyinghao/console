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

// 刷新token 会话过期
eventEmitter.on('API:UN_AUTH', async (response) => {
    await ElMessageBox.alert(response.message, '提示', { type: 'warning' })
    await useUserStore().loginOut(false)
    router.replace('/login')
})

export default router
export function setupRoute(app: App) {
    app.use(router)
    createRouterGuard(router)
}
