import { AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { requestConfig, ResponseData, ResponseEnum } from './types'

/**
 * 处理 axios 返回信息
 * @param response 相应对象
 */
export const handleResponse = <T>(response: AxiosResponse) => {
    return new Promise((resolve, reject) => {
        const { code, message, data } = response.data as ResponseData<T>

        // 是否处理消息提示
        const handleMessage = (response.config as requestConfig).handleMessage

        if (code === ResponseEnum.success) {
            if (response.config.method !== 'get' && handleMessage && message) {
                ElMessage({ type: 'success', message })
            }
            resolve(data)
        } else {
            if (handleMessage) {
                ElMessage({ type: 'error', message })
            }
            reject(new Error(message))
        }
    })
}
