import { requestGet } from '@/service/request'
import { PagingResponse } from '@/types/pagingResponse'

export interface JobLog {
    id: number
    /** 任务id */
    jobId: number
    /** 任务名称 */
    jobName: string
    /** 执行状态（0：失败, 1：成功） */
    status: number
    /** 错误日志 */
    err: string
    /** 消耗时间 */
    consumeTime: number
    /** 执行时间 */
    createTime: Date
}

/** 获取定时任务日志分页信息 */
export const fetchJobLogInfos = (params: Record<string, string>) => {
    return requestGet<PagingResponse<JobLog>>('/monitor/job-log/list', {
        params
    })
}
