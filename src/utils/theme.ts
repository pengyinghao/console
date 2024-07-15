/** 主色 */
const PRE = '--el-color-primary'
/** 变量阶梯色 */
const PRE_LIGHT = `${PRE}-light`
/** 暗黑 */
const PRE_DARK = `${PRE}-dark`

// 白色混合色
const MIX_WIDTH = '#ffffff'
// 黑色混合色
const MIX_BLACK = '#000000'

const html = document.documentElement

// https://github.com/cool-team-official/cool-admin-vue/blob/7.x/src/modules/theme/utils/index.ts
const mix = (color1: string, color2: string, weight: number) => {
    weight = Math.max(Math.min(Number(weight), 1), 0)
    const r1 = parseInt(color1.substring(1, 3), 16)
    const g1 = parseInt(color1.substring(3, 5), 16)
    const b1 = parseInt(color1.substring(5, 7), 16)
    const r2 = parseInt(color2.substring(1, 3), 16)
    const g2 = parseInt(color2.substring(3, 5), 16)
    const b2 = parseInt(color2.substring(5, 7), 16)
    let r = Math.round(r1 * (1 - weight) + r2 * weight).toString(16)
    let g = Math.round(g1 * (1 - weight) + g2 * weight).toString(16)
    let b = Math.round(b1 * (1 - weight) + b2 * weight).toString(16)
    r = `0${(r || 0).toString(16)}`.slice(-2)
    g = `0${(g || 0).toString(16)}`.slice(-2)
    b = `0${(b || 0).toString(16)}`.slice(-2)
    return `#${r}${g}${b}`
}

/**
 * 修改主题色
 * @param color 颜色
 */
export const changeTheme = (color?: string) => {
    if (!color) return

    // 设置主色
    if (color) {
        html.style.setProperty(PRE, color)
        html.style.setProperty('--color-primary', color)

        // 设置辅色
        for (let i = 1; i < 10; i += 1) {
            html.style.setProperty(`${PRE_LIGHT}-${i}`, mix(color, MIX_WIDTH, i * 0.1))
            html.style.setProperty(`${PRE_DARK}-${i}`, mix(color, MIX_BLACK, i * 0.1))
        }
    }
}
