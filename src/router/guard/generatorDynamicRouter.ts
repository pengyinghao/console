import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import { SystemMenu } from '@/service/api/system/menu'
import { dataToTree, getComponentName } from '@/utils'

/** 导入模块 */
const allPages = import.meta.glob('@/views/**/**/*.vue') // views 下的所有vue文件

/** 导入模块 */
function importModule(path: string | undefined) {
    if (!path) return null
    const moduleUrl = `/src/views/${path}.vue`
    return allPages[moduleUrl] || null
}

/** 路由 参数 */
function markRoute(page: SystemMenu, component: any) {
    const { name, id, parentId, icon, component: componentUrl, openType, url, display } = page

    const componentName = getComponentName(componentUrl as string)

    const currentRouter: RouteRecordRaw = {
        path: url || '',
        children: [],
        component,
        name: componentName,
        meta: {
            name,
            id: id.toString(),
            parentId,
            icon,
            openType,
            display
        }
    }
    return currentRouter
}

/** 构建单级路由 */
function generatorSingleLevelRoute(menu: SystemMenu): RouteRecordRaw {
    const { name, icon, component } = menu
    const currentRouter: RouteRecordRaw = markRoute(menu, importModule(component))
    return {
        component: Layout,
        path: '',
        meta: {
            name,
            icon
        },
        children: [currentRouter]
    }
}

/** 构建动态路由 */
function generatorDynamicRouter(pages: SystemMenu[]): RouteRecordRaw[] {
    const routers = pages.map((page) => {
        const { parentId, component, children } = page

        // 嵌套一层layout 用于来装载单级路由页面
        if (page.parentId === null && page.children?.length === 0) {
            return generatorSingleLevelRoute(page)
        }

        // 多级菜单，顶级用来装载layout
        const currentRouter: RouteRecordRaw = markRoute(page, parentId === null ? Layout : importModule(component))
        // 存在子级
        if (children && children.length > 0) {
            currentRouter.children = generatorDynamicRouter(children)
        } else {
            currentRouter.children = []
        }
        return currentRouter
    })
    return routers
}

export default function createRoute(menus: SystemMenu[]) {
    const res = dataToTree(menus, 'parentId')
    return generatorDynamicRouter(res)
}
