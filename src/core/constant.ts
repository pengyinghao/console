import { Status } from './enums/status'

/** axios 请求的基路径 */
export const BASE_URL = '/api'

/** axios 请求超时时间 */
export const TIME_OUT = 1000 * 60 * 5

export const ACCESS_TOKEN = 'access_token'
export const REFRESH_TOKEN = 'refresh_token'

/** 状态表单项 */
export const STATUS_FORM_ITEM = [
    { label: '禁用', value: Status.DISABLED },
    { label: '启用', value: Status.ENABLE }
]
