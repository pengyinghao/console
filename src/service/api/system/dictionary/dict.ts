import { requestDelete, requestGet, requestPost, requestPut } from '@/service/request'

export interface Dict {
    id: number
    /** 字典名称 */
    name: string
    /** 状态(0:禁用，1:启用) */
    status: Status
    /** 字典值 */
    value: string
    /** 显示顺序 */
    sort: number
    /** 类型id */
    typeId: number
    /** 备注 */
    remark?: string
}

export type UpdateDictOption = Optional<Dict, 'id' | 'typeId'>
export type TypeNoToDict = Pick<Dict, 'id' | 'value'> & { label: string }

/** 获取字典分页信息 */
export const fetchDictInfos = (params: Record<string, any>) => {
    return requestGet('/system/dict', {
        params
    })
}

/** 创建字典信息 */
export const createDict = (option: UpdateDictOption) => {
    return requestPost('/system/dict', option)
}

/** 修改字典信息 */
export const updateDict = (option: UpdateDictOption) => {
    return requestPut('/system/dict', option)
}

/** 修改字典状态 */
export const updateDictState = (id: number, status: Status) => {
    return requestPut('/system/dict/status', {
        id,
        status
    })
}

/** 获取字典信息详情 */
export const fetchDictDetail = (id: number) => {
    return requestGet(`/system/dict/${id}`)
}

/** 通过类型编号查询 字典信息 */
export const fetchDictTypeNo = (no: string) => {
    return requestGet<TypeNoToDict[]>(`/system/dict/type_no/${no}`)
}

/** 删除字典信息 */
export const deleteDict = (id: number) => {
    return requestDelete(`/system/dict/${id}`)
}
