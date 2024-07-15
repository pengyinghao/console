import { requestGet } from '@/service/request'
import { PagingResponse } from '@/types/pagingResponse'

export interface LoginInfo {
    id: number
    /** 用户名 */
    account: string
    /** 登录ip */
    loginIp: string
    /** 登录地址 */
    loginAddr: string
    /** 登录时间 */
    loginTime: Date
    /** 浏览器 */
    browser: string
    /** 操作系统 */
    os: string
    /** 登录状态 */
    status: 0 | 1
    /** 消息 */
    message: string
}

/** 获取登录日志 分页信息 */
export const fetchLoginInfoInfos = (params: Record<string, string>) => {
    return requestGet<PagingResponse<LoginInfo>>('/log/login/list', {
        params
    })
}
