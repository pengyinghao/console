import { requestDelete, requestGet, requestPost, requestPut } from '@/service/request'

export interface Menu {
    id: number
    /** 状态(0：禁用，1：启用) */
    state: number
    /** 菜单名称 */
    name: string
    /** 菜单图标 */
    icon?: string
    /** 打开方式 (0：路由，1：内嵌，2：链接) */
    openType: number
    /** 显示顺序 */
    sort: number
    /** 上级菜单id */
    parentId?: number
    /** 组件地址 */
    componentLink?: string
    /** 页面地址 */
    url?: string
    /** 是否隐藏菜单 */
    hidden: boolean
    /** 路由参数 */
    params?: string
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
    children?: Menu[]
}

export type UpdateSystemMenuOption = Omit<Optional<Menu, 'id'>, 'createTime' | 'updateTime'>
export type PartialMenu = Partial<Menu>
export type SystemMenu = { children: SystemMenu[] } & Pick<
    Menu,
    | 'id'
    | 'componentLink'
    | 'hidden'
    | 'icon'
    | 'openType'
    | 'params'
    | 'parentId'
    | 'sort'
    | 'url'
    | 'name'
>

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
