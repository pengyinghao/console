import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/core/constant'
import { fetchRefreshToken } from '../api/auth'
import { request } from './baseRequest'

let refreshing = false
const queue: ((token: string) => void)[] = []
export const handleRefreshToken = async (error: any) => {
    const { config } = error.response
    if (refreshing) {
        return new Promise((resolve) => {
            queue.push((newToken: string) => {
                Reflect.set(config.headers, 'authorization', newToken)
                resolve(request(config))
            })
        })
    }

    refreshing = true

    const { data, status } = await fetchRefreshToken(localStorage.getItem(REFRESH_TOKEN) || '')
    const accessToken = data.data.access_token
    localStorage.setItem(ACCESS_TOKEN, accessToken || '')
    localStorage.setItem(REFRESH_TOKEN, data.data.refresh_token || '')

    refreshing = false

    if (status === 200) {
        // 执行 缓存的 请求
        queue.forEach((cb) => cb(accessToken))

        // 执行当前请求
        Reflect.set(config.headers, 'authorization', accessToken)
        return request(config)
    }
    return Promise.reject(data)
}
