/** 主色 */
const PRE = '--el-color-primary'
/** 变量阶梯色 */
const PRE_LIGHT = `${PRE}-light`
/** 暗黑 */
const PRE_DARK = `${PRE}-dark`

/** 白色 */
const WHITE = '#ffffff'
/** 黑色 */
const BLACK = '#000000'

const html = document.documentElement

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

/** 混合颜色 */
const mix = (color1: string, color2: string, weight: number) => {
    const tmpWeight = Math.max(Math.min(Number(weight), 1), 0)
    const r1 = parseInt(color1.substring(1, 3), 16)
    const g1 = parseInt(color1.substring(3, 5), 16)
    const b1 = parseInt(color1.substring(5, 7), 16)
    const r2 = parseInt(color2.substring(1, 3), 16)
    const g2 = parseInt(color2.substring(3, 5), 16)
    const b2 = parseInt(color2.substring(5, 7), 16)

    const r = Math.round(r1 * (1 - tmpWeight) + r2 * tmpWeight)
    const g = Math.round(g1 * (1 - tmpWeight) + g2 * tmpWeight)
    const b = Math.round(b1 * (1 - tmpWeight) + b2 * tmpWeight)

    const red = `0${(r || 0).toString(16)}`.slice(-2)
    const green = `0${(g || 0).toString(16)}`.slice(-2)
    const blue = `0${(b || 0).toString(16)}`.slice(-2)
    return `#${red}${green}${blue}`
}

/**
 * 修改主题色
 * @param color 颜色
 */
export const changeTheme = (color?: string) => {
    if (!color) return
    // 设置主要颜色
    html.style.setProperty(PRE, color)

    // 主色
    const arr = [3, 5, 7, 8, 9]
    for (let i = 0; i < arr.length; i += 1) {
        html.style.setProperty(`${PRE_LIGHT}-${arr[i]}`, mix(color, WHITE, arr[i] * 0.1))
    }

    // 暗黑色设置
    const dark = mix(color, BLACK, 0.2)
    html.style.setProperty(`${PRE_DARK}-2`, dark)
}
