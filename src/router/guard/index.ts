import { Router, RouteRecordRaw } from 'vue-router'
import { LOGIN_PATH, ALLOW_LIST, FORBIDDEN_PATH } from '@/core/config'
import NProgress from '@/plugins/nprogress'
import { useUserStore } from '@/store'
import { clearPendingPool } from '@/service/request/baseRequest'
import { ACCESS_TOKEN } from '@/core/constant'

/** 创建路由守卫 */
export function createRouterGuard(router: Router) {
    router.beforeEach(async (to, form, next) => {
        clearPendingPool()
        const userStore = useUserStore()
        NProgress.start()
        if (ALLOW_LIST.includes(to.path)) {
            return next()
        }

        if (sessionStorage.getItem(ACCESS_TOKEN)) {
            if (userStore.dynamicRoute.length === 0) {
                const current = await userStore.getUserCurrent()
                //  未返回菜单，则跳到403
                if (current.menu.length === 0) return next({ path: FORBIDDEN_PATH })

                const routes = await userStore.generateRoutes()
                routes.forEach((r: RouteRecordRaw) => {
                    userStore.dynamicRoute.push(router.addRoute(r))
                })
                return next({ path: current.redirect, replace: true })
            }
            return next()
        }

        next(LOGIN_PATH)
    })

    router.afterEach(() => {
        NProgress.done()
    })
}
