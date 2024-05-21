import { requestDelete, requestGet, requestPost, requestPut } from '@/service/request'

export interface Param {
    id: number
    /** 参数名称 */
    name: string
    /** 参数键 */
    label: string
    /** 参数值 */
    value: string
    /** 是否系统内置 */
    sys: boolean
    /** 备注 */
    remark?: string
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
}

/** 查询条件 */
export type ParamsQueryParams = Partial<Pick<Param, 'name'>>
export type UpdateParam = Omit<Optional<Param, 'id'>, 'createTime' | 'updateTime' | 'sys'>

/** 获取参数分页列表 */
export const fetchParamInfos = (params: Record<string, any>) => {
    return requestGet('/system/param', { params })
}

/**  创建参数 */
export const createParam = (option: UpdateParam) => {
    return requestPost('/system/param', option)
}

/** 修改参数 */
export const updateParam = (option: UpdateParam) => {
    return requestPut('/system/param', option)
}

/** 删除参数 */
export const deleteParam = (id: number) => {
    return requestDelete(`/system/param/${id}`)
}

/** 通过参数键查询参数信息 */
export const fetchParam = (label: string) => {
    return requestGet(`/system/param/label/${label}`)
}

/** 查询参数详情 */
export const fetchParamDetail = (id: number) => {
    return requestGet(`/system/param/${id}`)
}
