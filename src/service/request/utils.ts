import { CreateAxiosDefaults } from 'axios'
import { requestConfig } from './types'

export const baseRequestConfig = (config?: CreateAxiosDefaults) => {
    const retryConfig: requestConfig = {
        handleData: true,
        handleMessage: true,
        global: false
    }
    Object.assign(retryConfig, config)
    return retryConfig
}
