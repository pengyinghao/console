import { requestDelete, requestGet, requestPost, requestPut } from '@/service/request'
import { PagingResponse } from '@/types/pagingResponse'

export interface Crontab {
    id: number
    /** 任务名称 */
    name: string
    /** 任务状态 */
    status: Status
    /** 任务类型 */
    type: 'sys' | 'task'
    /** 定时表达式 */
    expression: string
    /** 任务执行参数 */
    params?: string
    /** 任务描述 */
    remark?: string
    /** 任务最后执行时间 */
    lastExecTime?: Date
}

export type UpdateCrontabOption = Optional<Omit<Crontab, 'status'>, 'id'>

/** 获取定时任务分页信息 */
export const fetchCrontabInfos = (params: Record<string, string>) => {
    return requestGet<PagingResponse<Crontab>>('/system/crontab/list', {
        params
    })
}

/** 获取定时任务详情 */
export const fetchCrontabDetail = (id: number) => {
    return requestGet<Crontab>(`/system/crontab/${id}`)
}

/** 创建定时任务 */
export const createCrontab = (data: UpdateCrontabOption) => {
    return requestPost(`/system/crontab`, data)
}

/** 修改定时任务 */
export const updateCrontab = (data: UpdateCrontabOption) => {
    return requestPut(`/system/crontab`, data)
}

/** 删除定时任务 */
export const deleteCrontab = (id: number) => {
    return requestDelete(`/system/crontab/${id}`)
}

/** 修改定时任务状态 */
export const updateCrontabState = (id: number, status: Status) => {
    return requestPut(`/system/crontab/status`, {
        id,
        status
    })
}
