import { Status } from '@/core/enums/status'
import { requestDelete, requestGet, requestPost, requestPut } from '@/service/request'
/** 枚举定义菜单打开方式 */
export enum MenuOpenType {
    /** 路由 */
    ROUTE = 0,
    /** 内嵌 */
    IFRAME = 1,
    /**  链接 */
    LINK = 2
}

/** 枚举定义菜单类型 */
export enum MenuType {
    /** 目录 */
    DIRECTORY = 0,
    /** 菜单 */
    MENU = 1,
    /** 按钮 */
    BUTTON = 2
}

/** 枚举定义菜单显示状态 */
export enum MenuDisplay {
    /** 显示 */
    SHOW = 0,
    /** 隐藏 */
    HIDE = 1
}

/** 枚举定义菜单固定状态 */
export enum MenuFixed {
    /** 固定 */
    FIXED = 0,
    /** 不固定 */
    NOT_FIXED = 1
}

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
    type: MenuType
    /** 打开方式 (0：路由，1：内嵌，2：链接) */
    openType: MenuOpenType
    /** 显示顺序 */
    sort: number
    /** 上级菜单id */
    parentId?: number | null
    /** 组件地址 */
    component?: string
    /** 页面地址 */
    url?: string
    /** 显示状态(0：显示，1：隐藏) */
    display: MenuDisplay
    /** 路由参数 */
    params?: string
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
    /** 固定页签(0:固定，1：不固定) */
    fixed: MenuFixed
    children?: Menu[]
}

/** 更新菜单选项类型 */
export type UpdateSystemMenuOption = Omit<Optional<Menu, 'id'>, 'createTime' | 'updateTime'>
/** 菜单只读 */
export type PartialMenu = Partial<Menu>
/** 系统菜单类型 */
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
/** 按钮类型 */
export type Buttons = { menuId: number } & Pick<Menu, 'id' | 'code' | 'icon'>
/** 默认导航类型 */
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
