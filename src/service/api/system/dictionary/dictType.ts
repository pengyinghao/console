import { requestDelete, requestGet, requestPost, requestPut } from '@/service/request'
import { PagingResponse } from '@/types/pagingResponse'

export interface DictType {
    id: number
    /** 编号 */
    no: string
    /** 类型名称 */
    name: string
    /** 状态 */
    status: Status
    /** 备注 */
    remark?: string
}

export type UpdateDictTypeOption = Omit<DictType, 'id'>

/** 获取字典分类分页信息 */
export const fetchDictTypeInfos = (params: Record<string, string>) => {
    return requestGet<PagingResponse<DictType>>('/system/dict_type', {
        params
    })
}

/** 获取字典类型详情 */
export const fetchDictTypeDetail = (id: number) => {
    return requestGet<DictType>(`/system/dict_type/${id}`)
}

/** 创建字典信息 */
export const createDictType = (data: UpdateDictTypeOption) => {
    return requestPost(`/system/dict_type`, data)
}

/** 修改字典类型 */
export const updateDictType = (id: number, data: UpdateDictTypeOption) => {
    return requestPut(`/system/dict_type/${id}`, data)
}

/** 删除字典类型 */
export const deleteDictType = (id: number) => {
    return requestDelete(`/system/dict_type/${id}`)
}

/** 修改字典类型状态 */
export const updateDictTypeState = (id: number, status: Status) => {
    return requestPut(`/system/dict_type/status`, {
        id,
        status
    })
}

/** 查询所有字典类型信息 */
export const fetchDictTypeAllInfos = () => {
    return requestGet<DictType[]>('system/dict_type/all')
}
