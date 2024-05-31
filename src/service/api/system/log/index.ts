import { requestGet } from '@/service/request'

export type ActionType = 'create' | 'update' | 'delete' | 'other'
export interface Log {
    id: string
    /** 模块名 */
    moduleName: string
    /** 操作类型 */
    actionType: ActionType
    /** 操作人 */
    actionName: string
    /** 操作人ip */
    actionIp?: string
    /** 操作内容 */
    actionMessage: string
    /** 操作人地址 */
    actionAddress?: string
    /** 操作方法 */
    actionFunction: string
    /** 状态 */
    status: string
    /** 创建时间 */
    createTime: Date
    /** 请求方式 */
    requestMethod: string
    /** 请求地址 */
    requestUrl: string
    /** 请求参数 */
    requestParams: string
    /** 花费时间 */
    costTime: number
}

/** 查询分页日志 */
export const fetchLogInfos = (params: Record<string, any>) => {
    return requestGet('/system/log/list', { params })
}
