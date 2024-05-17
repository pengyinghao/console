import { request } from './baseRequest'
import type { requestConfig } from './types'

export const sendRequest = <T>(config: requestConfig) => {
    return request<T>(config)
}
/**
 * get请求
 * @param url - 请求地址
 * @param config - axios配置
 */
export const requestGet = <T = any>(url: string, config?: requestConfig) => {
    const newConfig: any = {
        method: 'get',
        url,
        ...config
    }

    // if (config && config.params) {
    //     newConfig.paramsSerializer = () => {
    //         return qs.stringify(config.params, {
    //             arrayFormat: 'repeat'
    //         })
    //     }
    // }
    return sendRequest<T>(newConfig)
}

/**
 * post请求
 * @param url - 请求地址
 * @param data - 请求的body的data
 * @param config - axios配置
 */
export const requestPost = <T = any>(url: string, data?: any, config?: requestConfig) => {
    return sendRequest<T>({ url, method: 'post', data, ...config })
}

/**
 * put请求
 * @param url - 请求地址
 * @param data - 请求的body的data
 * @param config - axios配置
 */
export const requestPut = <T = any>(url: string, data?: any, config?: requestConfig) => {
    return sendRequest<T>({ url, method: 'put', data, ...config })
}

/**
 * delete请求
 * @param url - 请求地址
 * @param config - axios配置
 */
export const requestDelete = <T = any>(url: string, config?: requestConfig) => {
    return sendRequest<T>({ url, method: 'delete', ...config })
}
