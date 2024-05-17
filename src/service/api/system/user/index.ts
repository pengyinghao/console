import { requestDelete, requestGet, requestPost, requestPut } from '@/service/request'
import { PagingResponse } from '@/types/pagingResponse'

/** 用户实体 */
export interface User {
    /** id */
    id: string
    /** 状态 */
    state: 0 | 1
    /** 编号 */
    no: string
    /** 姓名 */
    name: string
    /** 账号 */
    account: string
    /** 手机号码 */
    phone: string
    /** 是否冻结 */
    freeze: boolean
    /** 邮箱 */
    email?: string
    /** 地址 */
    address?: string
    /** 是否系统用户 */
    sysUser: boolean
    /** 头像 */
    avatar?: string
    /** 创建时间 */
    createdTime: string
    /** 更新时间 */
    updatedTime: string
}

/** 创建用户表单提交 */
export type CreateUserOption = { password: string } & Pick<
    User,
    'name' | 'no' | 'account' | 'phone' | 'email' | 'address'
>

/** 修改用户表单提交 */
export type UpdateUserOption = Optional<
    Pick<User, 'name' | 'phone' | 'sysUser' | 'email' | 'address' | 'id'>,
    'id'
>

/** 获取用户分页信息 */
export const fetchUserInfos = (params: Record<string, string>) => {
    return requestGet<PagingResponse<User>>('/system/user', {
        params
    })
}

/** 获取用户详情 */
export const fetchUserDetail = (id: number | string) => {
    return requestGet(`/system/user/${id}`)
}

/** 创建用户 */
export const createUser = (formData: CreateUserOption) => {
    return requestPost('/system/user', formData)
}

/** 更新用户 */
export const updateUser = (formData: UpdateUserOption) => {
    return requestPut('/system/user', formData)
}

/** 更新用户状态 */
export const updateUserState = (id: string, state: 0 | 1) => {
    return requestPut(`/system/user/state`, {
        id,
        state
    })
}

/** 更新用户冻结状态 */
export const updateUserFreeze = (id: string, freeze: boolean) => {
    return requestPut(`/system/user/freeze`, {
        id,
        freeze
    })
}

/** 删除用户 */
export const deleteUser = (id: number | string) => {
    return requestDelete(`/system/user/${id}`)
}
