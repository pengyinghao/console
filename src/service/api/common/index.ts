import { requestGet } from '@/service/request'

interface CaptchaResponse {
    code: string
    uuid: string
}

/** 获取验证码 */
export const fetchCaptcha = () => {
    return requestGet<CaptchaResponse>('/captcha')
}
