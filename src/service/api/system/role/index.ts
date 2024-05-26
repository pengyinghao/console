import { requestDelete, requestGet, requestPost, requestPut } from '@/service/request'
import { User } from '../user'

export interface Role {
    id: number
    /** 角色标识 */
    code: string
    /** 默认导航地址 */
    defaultNavigate?: string
    /** 角色名称 */
    name: string
    /** 角色类型 */
    type: number
    /** 备注 */
    remark?: string
    createTime: string
    updateTime: string
}

export type UpdateRoleOption = Optional<Omit<Role, 'createTime' | 'updateTime'>, 'id' | 'type'>

/** 获取所有的角色信息 */
export const fetchRoleInfos = (params: Record<string, any>) => {
    return requestGet<Role[]>('/system/role', { params })
}

/** 创建角色 */
export const createRole = (option: UpdateRoleOption) => {
    return requestPost('/system/role', option)
}

/** 修改角色 */
export const updateRole = (option: UpdateRoleOption) => {
    return requestPut('/system/role', option)
}

/** 获取角色详情 */
export const fetchRoleDetail = (id: number) => {
    return requestGet<Role>(`/system/role/${id}`)
}

/** 删除角色 */
export const deleteRole = (id: number) => {
    return requestDelete(`/system/role/${id}`)
}

/** 授权 */
export const authorize = (option: {
    roleId: number
    menuIds: number[]
    defaultNavigate: string
}) => {
    return requestPost(`/system/role/authorize`, option)
}

/** 获取授权的菜单集合 */
export const fetchAuthorizeMenuIds = (roleId: number) => {
    return requestGet<number[]>(`/system/role/${roleId}/authorize`)
}

/** 获取角色下的用户 */
export const fetchRoleUser = (params: Record<string, any>) => {
    return requestGet<User[]>('system/role/user', { params })
}
