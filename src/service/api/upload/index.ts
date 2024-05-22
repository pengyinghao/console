import { requestGet, requestPost } from '@/service/request'

export interface Upload {
    /** id */
    id: number
    /** 文件大小 */
    size: number
    /** 原文件名 */
    originalname: string
    /** 文件名 */
    fileName: string
    /** 文件地址 */
    url: string
    /** 拓展名 */
    ext: string
    /** 创建时间 */
    createTime: Date
}

/** 文件上传 */
export const upload = (formData: FormData) => {
    return requestPost<string>('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        handleMessage: false
    })
}

/** 多个上传文件 */
export const uploadMultiple = (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => {
        formData.append('files', file)
    })
    return requestPost('/upload/upload-multiple', formData, {
        headers: {
            'Content-type': 'multipart/form-data'
        }
    })
}

/** 分页获取上传的文件信息 */
export const fetchUploadInfos = (params: Record<string, any>) => {
    return requestGet('/upload', { params })
}
