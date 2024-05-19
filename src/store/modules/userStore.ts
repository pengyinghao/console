import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import { reactive, ref } from 'vue'
import createRoute from '@/router/guard/generatorDynamicRouter'
import { UserDetail, fetchUserCurrent } from '@/service/api/system/user'
import { SystemMenu } from '@/service/api/system/menu'

export const useUserStore = defineStore(
    'user',
    () => {
        const info = reactive<UserDetail>({
            account: '',
            name: '',
            id: '',
            phone: ''
        })

        const defaultRouterPath = ref('')

        /** 返回的原有菜单 */
        const originMenus = ref<SystemMenu[]>([])
        /** 处理果的路由信息 */
        const routes = ref<RouteRecordRaw[]>([])
        /** 动态路由 */
        const dynamicRoute = ref<(() => void)[]>([])

        /** 退出登录 */
        const loginOut = () => {
            // 通过动态路由移出 路由信息
            dynamicRoute.value.forEach((fn) => fn())
        }

        const getUserCurrent = async () => {
            const res = await fetchUserCurrent()
            Object.assign(info, res.user)
            console.log(res.user, 123)
            originMenus.value = res.menu
            defaultRouterPath.value = res.redirect
            return res
        }

        /** 创建路由 */
        const generateRoutes = () => {
            const routesRes = createRoute(originMenus.value)
            routes.value = routesRes
            return Promise.resolve(routesRes)
        }

        return {
            info,
            routes,
            originMenus,
            dynamicRoute,
            loginOut,
            generateRoutes,
            getUserCurrent,
            defaultRouterPath
        }
    },
    {
        persist: {
            key: 'user',
            storage: sessionStorage,
            paths: ['info']
        }
    }
)
