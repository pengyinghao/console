import cloneDeep from 'lodash-es/cloneDeep'
import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import { reactive, ref } from 'vue'
import createRoute from '@/router/guard/generatorDynamicRouter'
import { menuInfos } from '@/menus'

interface UserInfo {
    /** 用户名称 */
    userName: string
    /** 头像地址 */
    avatar: string
    /** 用户名 */
    account: string
}

export const useUserStore = defineStore(
    'user',
    () => {
        const info = reactive<UserInfo>({
            account: 'account',
            avatar: 'https://picsum.photos/200',
            userName: ''
        })

        /** 处理果的路由信息 */
        const routes = ref<RouteRecordRaw[]>([])
        /** 默认系统菜单 */
        const originMenus = ref<SystemMenu[]>([])
        /** element 菜单 */
        const elementMenus = ref<RouteRecordRaw[]>([])
        /** 动态路由 */
        const dynamicRoute = ref<(() => void)[]>([])

        /** 退出登录 */
        const loginOut = () => {
            // 通过动态路由移出 路由信息
            dynamicRoute.value.forEach((fn) => fn())
            // this.$reset()
        }

        /** 处理element菜单  */
        const markElementRoute = (routes: RouteRecordRaw[]) => {
            const newRouter = cloneDeep(routes) // 将单级路由解析出来，用到element 菜单中
            elementMenus.value = newRouter.map((item) => {
                if (item.meta?.singleLevel && item.children && item.children.length > 0) {
                    return item.children[0]
                }
                return item
            })
        }
        /** 创建路由 */
        const generateRoutes = () => {
            originMenus.value = cloneDeep(menuInfos)
            const routesRes = createRoute(menuInfos)
            routes.value = routesRes
            markElementRoute(routesRes)
            return Promise.resolve(routesRes)
        }

        return {
            info,
            routes,
            originMenus,
            elementMenus,
            dynamicRoute,
            loginOut,
            generateRoutes
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
