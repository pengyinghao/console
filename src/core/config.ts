import { AppStore } from '@/store/modules/appStore'

/** 登录地址 */
export const LOGIN_PATH = '/login'

/**  403页面 */
export const FORBIDDEN_PATH = '/forbidden'

/** 白名单地址 */
export const ALLOW_LIST = [LOGIN_PATH, FORBIDDEN_PATH]

/**  默认值 */
export const DEFAULT_APP_STORE: AppStore = {
    themeMode: 'light',
    followSystemTheme: false,
    theme: '#0072ff',
    menuIsCollapse: false,
    menuCollapseWidth: 68,
    menuWidth: 220,
    disableAnimation: false,
    animationType: 'fade-slide',
    showPreferenceSetting: false,
    showBreadcrumb: true,
    showTab: true,
    keepAlive: true,
    keepAliveCounter: 10,
    size: 'default'
}
