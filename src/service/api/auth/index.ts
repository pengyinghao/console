import { AxiosResponse } from 'axios'
import { UserLoginParams, UserLoginResponse } from './auth-type'
import { requestGet, requestPost } from '@/service/request'
import { ResponseData } from '../../request/types'

/** 登录 */
export const login = (params: UserLoginParams) => {
    return requestPost<UserLoginResponse>('/system/user/login', params, {
        handleMessage: false
    })
}

/** 刷新token */
export const fetchRefreshToken = (token: string) => {
    return requestGet<AxiosResponse<ResponseData<UserLoginResponse>>>(
        `/system/user/refresh?refresh_token=${token}`,
        {
            handleData: false
        }
    )
}
