import { requestDelete, requestGet, requestPost, requestPut } from '@/service/request'

export interface Role {
    id: number
    /** 角色名称 */
    name: string
    /** 备注 */
    remark?: string
    createTime: string
    updateTime: string
}

export type UpdateRoleOption = Optional<Omit<Role, 'createTime' | 'updateTime'>, 'id'>

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
