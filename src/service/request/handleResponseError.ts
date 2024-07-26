import { ElMessage } from 'element-plus'
import { handleRefreshToken } from './handleRefreshToken'
import { eventEmitter } from '@/utils/eventEmitter'
import { ERROR_STATUS, ResponseEnum } from './types'

export const handleResponseError = async (error: any) => {
    if (error.code === 'ERR_CANCELED') {
        return Promise.reject(error.message)
    }

    const { config } = error.response

    // 刷新token
    if (error.response.status === ResponseEnum.UNAUTHORIZED && !config.url.includes('/user/refresh')) {
        return handleRefreshToken(error)
    }

    // 刷新token遇到 token过期 ，重新登录
    if (
        (error.response.status === ResponseEnum.UNAUTHORIZED && config.url.includes('/user/refresh')) ||
        error.response.data.code === ResponseEnum.SESSION_EXPIRED
    ) {
        return eventEmitter.emit('API:UN_AUTH', error.response.data)
    }

    if (error.response.status !== 200) {
        const message = error.response.data.message || ERROR_STATUS[error.response.status] || '服务器错误'
        ElMessage({
            type: 'error',
            message
        })
        return Promise.reject(error.response.data)
    }

    return error.response
}
