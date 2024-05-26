import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import { reactive, ref } from 'vue'
import createRoute from '@/router/guard/generatorDynamicRouter'
import { UserDetail, fetchUserCurrent } from '@/service/api/system/user'
import { Buttons, SystemMenu } from '@/service/api/system/menu'
import defaultAvatar from '@/assets/images/default-avatar.png'

export const useUserStore = defineStore(
    'user',
    () => {
        const info = reactive<UserDetail>({
            account: '',
            name: '',
            id: 0,
            phone: ''
        })

        const setAvatar = (url: string) => {
            if (url) {
                info.avatar = import.meta.env.DEV ? import.meta.env.VITE_BASE_URL + url : url
            } else {
                info.avatar = defaultAvatar
            }
        }
        const defaultRouterPath = ref('')

        /** 返回的原有菜单 */
        const originMenus = ref<SystemMenu[]>([])
        /** 有权限的菜单集合 */
        const buttons = ref<Buttons[]>([])
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
            setAvatar(res.user.avatar!)

            originMenus.value = res.menu
            buttons.value = res.btn
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
            setAvatar,
            routes,
            originMenus,
            buttons,
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
