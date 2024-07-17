import mitt from 'mitt'
import { ResponseData } from '@/service/request/types'

interface EventName {
    /** 未授权 */
    'API:UN_AUTH': ResponseData<unknown>
    /** 后端返回的请求错误或者参数错误 */
    'API:ERROR': ResponseData<unknown>
    /** 刷新页面 */
    REFRESH_PAGE: void
}

type EventNames = {
    [K in keyof EventName]: EventName[K]
}

export const eventEmitter = mitt<EventNames>()
