import { MenuOpenTypeEnum } from '@/core/enums/menuOpenTypeEnum'
import { requestDelete, requestGet, requestPost, requestPut } from '@/service/request'

export interface Menu {
    id: number
    /** 状态 */
    status: Status
    /** 菜单名称 */
    name: string
    /** 功能代码 */
    code?: string
    /** 菜单图标 */
    icon?: string
    /** 菜单类型(0：目录，1：菜单，2：按钮) */
    type: number
    /** 打开方式 (0：路由，1：内嵌，2：链接) */
    openType: MenuOpenTypeEnum
    /** 显示顺序 */
    sort: number
    /** 上级菜单id */
    parentId?: number
    /** 组件地址 */
    component?: string
    /** 页面地址 */
    url?: string
    /** 显示状态(0：显示，1：隐藏) */
    display: number
    /** 路由参数 */
    params?: string
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
    /** 固定页签(0:固定，1：不固定) */
    fixed: 0 | 1
    children?: Menu[]
}

export type UpdateSystemMenuOption = Omit<Optional<Menu, 'id'>, 'createTime' | 'updateTime'>
export type PartialMenu = Partial<Menu>
export type SystemMenu = { children: SystemMenu[] } & Pick<
    Menu,
    | 'id'
    | 'component'
    | 'display'
    | 'icon'
    | 'openType'
    | 'params'
    | 'parentId'
    | 'sort'
    | 'url'
    | 'name'
    | 'type'
    | 'fixed'
>
export type Buttons = { menuId: number } & Pick<Menu, 'id' | 'code' | 'icon'>
export type DefaultNavigate = Pick<Menu, 'name' | 'url'>

/**  获取所有菜单(树形结构) */
export const fetchMenuInfos = (params?: Record<string, any>) => {
    return requestGet<Menu[]>('/system/menu', {
        params
    })
}

/** 创建菜单 */
export const createMenu = (option: UpdateSystemMenuOption) => {
    return requestPost('/system/menu', option)
}

/** 更新菜单 */
export const updateMenu = (option: UpdateSystemMenuOption) => {
    return requestPut('/system/menu', option)
}

/** 获取菜单详情 */
export const fetchMenuDetail = (id: number) => {
    return requestGet<PartialMenu>(`/system/menu/${id}`)
}

/** 获取树形菜单 */
export const fetchTreeMenu = () => {
    return requestGet<Menu[]>('/system/menu/tree_menu')
}

/** 删除菜单 */
export const deleteMenu = (id: number) => {
    return requestDelete(`/system/menu/${id}`)
}
