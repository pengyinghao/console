/** 用户登录 */
export interface UserLoginParams {
    account: string
    password: string
    code: string
}

/** 用户登录相应实体 */
export interface UserLoginResponse {
    /** 当前token */
    access_token: string
    /** 刷新token */
    refresh_token: string
}
