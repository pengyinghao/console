import { requestDelete, requestGet, requestPost, requestPut } from '@/service/request'
import { PagingResponse } from '@/types/pagingResponse'
import { Buttons, SystemMenu } from '../menu'

/** 用户实体 */
export interface User {
    /** id */
    id: number
    /** 状态 */
    status: Status
    /** 编号 */
    no: string
    /** 姓名 */
    name: string
    /** 账号 */
    account: string
    /** 手机号码 */
    phone: string
    /** 是否冻结(0：是，1：否) */
    freeze: number
    /** 邮箱 */
    email?: string
    /** 地址 */
    address?: string
    /** 是否系统用户(0：是,1:否) */
    sysUser: number
    /** 头像 */
    avatar?: string
    /** 角色id */
    roleId: number
    /** 角色名称 */
    roleName: string
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
}

/** 创建用户表单提交 */
export type CreateUserOption = { password: string } & Pick<
    User,
    'name' | 'no' | 'account' | 'phone' | 'email' | 'address'
>

/** 修改用户表单提交 */
export type UpdateUserOption = Optional<
    Pick<User, 'name' | 'phone' | 'email' | 'address' | 'id' | 'roleId' | 'roleName'>,
    'id' | 'roleId' | 'roleName'
>

export type UserDetail = Pick<User, 'id' | 'name' | 'account' | 'phone' | 'email' | 'avatar'>
export type UserCurrent = {
    menu: SystemMenu[]
    user: UserDetail
    btn: Buttons[]
    redirect: string
}

/** 获取用户分页信息 */
export const fetchUserInfos = (params: Record<string, string>) => {
    return requestGet<PagingResponse<User>>('/system/user', {
        params
    })
}

/** 获取用户详情 */
export const fetchUserDetail = (id: number) => {
    return requestGet<User>(`/system/user/${id}`)
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
export const updateUserState = (id: number, status: Status) => {
    return requestPut(`/system/user/status`, {
        id,
        status
    })
}

/** 更新用户冻结状态 */
export const updateUserFreeze = (id: number, freeze: number) => {
    return requestPut(`/system/user/freeze`, {
        id,
        freeze
    })
}

/** 删除用户 */
export const deleteUser = (id: number) => {
    return requestDelete(`/system/user/${id}`)
}

/** 获取当前用户信息、菜单、权限等 */
export const fetchUserCurrent = () => {
    return requestGet<UserCurrent>('/system/user/current')
}

/** 修改用户头像 */
export const uploadUserAvatar = (url: string) => {
    return requestPut(`/system/user/avatar?url=${url}`)
}
