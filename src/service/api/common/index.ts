import { AxiosResponse } from 'axios'
import { request } from '@/service/request/baseRequest'
/** 获取验证码 */
export const fetchCaptcha = (): Promise<AxiosResponse> => {
    return request({ url: '/captcha', responseType: 'arraybuffer', handleData: false })
}
