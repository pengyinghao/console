import { AppStore } from '@/store/modules/appStore'

/** 登录地址 */
export const LOGIN_PATH = '/login'

/**  403页面 */
export const FORBIDDEN_PATH = '/forbidden'

/** 白名单地址 */
export const ALLOW_LIST = [LOGIN_PATH, FORBIDDEN_PATH, '/test']

/**  默认值 */
export const DEFAULT_APP_STORE: AppStore = {
    themeMode: 'light',
    followSystemTheme: false,
    theme: '#0960bd',
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

export const themeColorList = [
    '#0960bd',
    '#0072ff',
    '#5856D6',
    '#536dfe',
    '#9c27b0',
    '#AF52DE',
    '#0096c7',
    '#00C1D4',
    '#34C759',
    '#43a047',
    '#7cb342',
    '#c0ca33',
    '#78DEC7',
    '#e53935',
    '#d81b60',
    '#f4511e',
    '#fb8c00',
    '#ffb300',
    '#fdd835',
    '#6d4c41',
    '#546e7a'
]
