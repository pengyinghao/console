import { requestPost } from '@/service/request'

/** 文件上传 */
export const upload = (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return requestPost('/upload/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
