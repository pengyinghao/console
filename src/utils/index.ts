/** 是否暗黑模式 */
export function isDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * 设置字段默认值
 * @param value value值
 * @param defaultValue 默认值
 * @returns
 */
export function setDefaultValue(value?: string | number, defaultValue = '--') {
    return value || defaultValue
}
