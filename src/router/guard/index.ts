import { Router, RouteRecordRaw } from 'vue-router'
import { LOGIN_PATH, ALLOW_LIST, FORBIDDEN_PATH } from '@/core/config'
import NProgress from '@/plugins/nprogress'
import { useTabStore, useUserStore } from '@/store'
import { clearPendingPool } from '@/service/request/baseRequest'
import { ACCESS_TOKEN } from '@/core/constant'
import { getComponentName } from '@/utils'

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
                const tabStore = useTabStore()
                tabStore.fixedMenu = current.menu
                    .filter((item) => item.fixed === 0 && item.url)
                    .sort((a, b) => a.sort - b.sort)
                    .map((item) => {
                        return {
                            name: item.name,
                            componentName: getComponentName(item.url as string),
                            path: item.url as string
                        }
                    })

                //  未返回菜单，则跳到403
                if (current.menu.length === 0) return next({ path: FORBIDDEN_PATH })

                const routes = await userStore.generateRoutes()
                routes.forEach((r: RouteRecordRaw) => {
                    userStore.dynamicRoute.push(router.addRoute(r))
                })

                return next({ path: to.path === '/' ? current.redirect : to.path, replace: true })
            }
            return next()
        }

        next(LOGIN_PATH)
    })

    router.afterEach(() => {
        NProgress.done()
    })
}
