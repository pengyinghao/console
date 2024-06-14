/** 主色 */
const PRE = '--el-color-primary'
/** 变量阶梯色 */
const PRE_LIGHT = `${PRE}-light`
/** 暗黑 */
const PRE_DARK = `${PRE}-dark`

const html = document.documentElement

/**
 * hex颜色转rgb颜色
 * @param str 颜色值字符串
 * @returns 返回处理后的颜色值
 */
function hexToRgb(str: any) {
    let hex: any = ''
    // eslint-disable-next-line no-useless-escape
    const reg = /^\#?[0-9A-Fa-f]{6}$/
    if (!reg.test(str)) {
        return
    }
    str = str.replace('#', '')
    hex = str.match(/../g)
    for (let i = 0; i < 3; i++) {
        hex[i] = Number.parseInt(hex[i], 16)
    }
    return hex
}

/**
 * rgb颜色转Hex颜色
 * @param r 代表红色
 * @param g 代表绿色
 * @param b 代表蓝色
 * @returns 返回处理后的颜色值
 */
function rgbToHex(r: any, g: any, b: any) {
    const reg = /^\d{1,3}$/
    if (!reg.test(r) || !reg.test(g) || !reg.test(b)) {
        return
    }
    const hex = [r.toString(16), g.toString(16), b.toString(16)]
    for (let i = 0; i < 3; i++) {
        if (hex[i].length === 1) {
            hex[i] = `0${hex[i]}`
        }
    }
    return `#${hex.join('')}`
}

/**
 * 变浅颜色值
 * @param color 颜色值字符串
 * @param level 加深的程度，限0-1之间
 * @returns 返回处理后的颜色值
 */
function getLightColor(color: string, level: number) {
    // eslint-disable-next-line no-useless-escape
    const reg = /^\#?[0-9A-Fa-f]{6}$/
    if (!reg.test(color)) {
        return
    }
    const rgb = hexToRgb(color)
    for (let i = 0; i < 3; i++) {
        rgb[i] = Math.floor((255 - rgb[i]) * level + rgb[i])
    }
    return rgbToHex(rgb[0], rgb[1], rgb[2])
}

/**
 * 加深颜色值
 * @param color 颜色值字符串
 * @param level 加深的程度，限0-1之间
 * @returns 返回处理后的颜色值
 */
function getDarkColor(color: string, level: number) {
    // eslint-disable-next-line no-useless-escape
    const reg = /^\#?[0-9A-Fa-f]{6}$/
    if (!reg.test(color)) {
        return
    }
    const rgb = hexToRgb(color)
    for (let i = 0; i < 3; i++) {
        rgb[i] = Math.floor(rgb[i] * (1 - level))
    }
    return rgbToHex(rgb[0], rgb[1], rgb[2])
}

/**
 * 修改主题色
 * @param color 颜色
 */
export const changeTheme = (color?: string) => {
    if (!color) return
    // 设置主要颜色
    html.style.setProperty(PRE, color)
    html.style.setProperty(`${PRE_DARK}-2`, `${getDarkColor(color, 0.5)}`)

    // 主色
    for (let i = 1; i <= 9; i++) {
        html.style.setProperty(`${PRE_LIGHT}-${i}`, `${getLightColor(color, i / 10)}`)
    }
}
