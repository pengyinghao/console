import { Status } from '@/core/enums/status'
import { requestDelete, requestGet, requestPost, requestPut } from '@/service/request'
import { PagingResponse } from '@/types/pagingResponse'

export enum JobImmediate {
    no,
    yes
}

export interface Job {
    id: number
    /** 任务名称 */
    name: string
    /** 任务状态 */
    status: Status
    /** 立即执行 */
    immediate: JobImmediate
    /** 定时表达式 */
    cron: string
    /** 任务执行服务 */
    service: string
    /** 任务执行参数 */
    params?: string
    /** 任务描述 */
    remark?: string
    /** 开始时间 */
    startTime?: string
    /** 结束时间 */
    endTime?: string
    /** 任务最后执行时间 */
    lastExecTime?: Date
}

export type UpdateJobOption = Optional<Omit<Job, 'status'>, 'id'>

/** 获取定时任务分页信息 */
export const fetchJobInfos = (params: Record<string, string>) => {
    return requestGet<PagingResponse<Job>>('/monitor/job/list', {
        params
    })
}

/** 获取定时任务详情 */
export const fetchJobDetail = (id: number) => {
    return requestGet<Job>(`/monitor/job/${id}`)
}

/** 创建定时任务 */
export const createJob = (data: UpdateJobOption) => {
    return requestPost(`/monitor/job`, data)
}

/** 修改定时任务 */
export const updateJob = (data: UpdateJobOption) => {
    return requestPut(`/monitor/job`, data)
}

/** 删除定时任务 */
export const deleteJob = (id: number) => {
    return requestDelete(`/monitor/job/${id}`)
}

/** 修改定时任务状态 */
export const updateJobState = (id: number, status: Status) => {
    return requestPost(`/monitor/job/status`, {
        id,
        status
    })
}

/** 立即执行任务 */
export const onceJob = (id: number) => {
    return requestPost(`/monitor/job/once/${id}`)
}
