import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { ACCESS_TOKEN, BASE_URL, TIME_OUT } from '@/core/constant'
import { handleResponse } from './handleResponse'
import { requestConfig } from './types'
import { handleResponseError } from './handleResponseError'
import { baseRequestConfig } from './utils'

const pendingPool = new Map()

const baseRequest = (opts: requestConfig) => {
    const config = baseRequestConfig(opts)
    const instance = axios.create({
        baseURL: BASE_URL,
        timeout: TIME_OUT,
        method: 'GET',
        ...config
    })

    return instance
}

/** 初始化请求拦截器 */
const requestInterceptor = (instance: AxiosInstance) => {
    instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(ACCESS_TOKEN)

        if (token) {
            config.headers.authorization = `Bearer ${token}`
        }

        config.cancelToken = new axios.CancelToken((cancelFn) => {
            if (pendingPool.has(config.url)) {
                cancelFn(`${config.url}请求重复`)
            } else {
                pendingPool.set(config.url, {
                    cancelFn,
                    global: (config as requestConfig).global
                })
            }
        })
        return config
    })
}

/** 初始化响应拦截器 */
const responseInterceptor = (instance: AxiosInstance) => {
    instance.interceptors.response.use(
        (response: any) => {
            pendingPool.delete(response.config.url)
            // 是否处理数据
            const handleData = (response.config as requestConfig).handleData
            if (!handleData) return response
            return handleResponse(response)
        },
        (error: any) => {
            if (!axios.isCancel(error)) pendingPool.delete(error.config.url)

            return handleResponseError(error)
        }
    )
}

const request = <T>(opts: requestConfig) => {
    const service = baseRequest(opts)
    requestInterceptor(service)
    responseInterceptor(service)
    return service(opts) as Promise<T>
}

/** 清除所有pending状态的请求 */
const clearPendingPool = () => {
    if (!pendingPool.size) return

    const pendingUrlList = Array.from(pendingPool.keys())
    if (!pendingUrlList.length) return

    pendingUrlList.forEach((pendingUrl) => {
        // 如果不为全局的请求，则移出
        if (!pendingPool.get(pendingUrl).global) {
            pendingPool.get(pendingUrl).cancelFn()
            pendingPool.delete(pendingUrl)
        }
    })

    return pendingUrlList
}

/** 取消某一个请求 */
const clearPending = (url: string) => {
    if (pendingPool.has(url)) {
        pendingPool.get(url).cancelFn()
        pendingPool.delete(url)
    }
}

export { baseRequest, request, clearPendingPool, clearPending }
