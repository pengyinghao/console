import dayjs from 'dayjs'

/** 是否暗黑模式 */
export function isDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/** 日期格式化 */
export function dateFormat(date: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!date) return date
    return dayjs(date).format(format)
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

/** 判断是否json格式 */
export function isJSON(str: string) {
    try {
        const obj = JSON.parse(str)
        return typeof obj === 'object' && obj
    } catch (e) {
        return false
    }
}

/**
 * 文本复制
 * @param sourceText 源文本
 * @param message 是否提示
 * @returns
 */
export function copyText(sourceText: string, message = true) {
    if (!sourceText.trim()) {
        return window.$message.warning('源文本不能为空')
    }
    const clipboard = window.navigator.clipboard
    if (clipboard) {
        clipboard
            .writeText(sourceText)
            .then(() => {
                message && window.$message.success('复制成功')
            })
            .catch(() => {
                window.$message.error('复制失败')
            })
    } else {
        const ta = document.createElement('textarea')
        ta.value = sourceText ?? ''
        ta.style.position = 'absolute'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        ta.remove()
        message && window.$message.success('复制成功')
    }
}

/**
 * 平面数据转换为树形结构
 * @param data  数据源
 * @param parentIdField 上级节点字段
 * @param idField  节点id字段
 * @returns
 */
export const dataToTree = <T extends { id: number; parentId?: number; children?: T[] }, K extends keyof T>(
    data: T[],
    parentIdField: K,
    idField: K = 'id' as K
): T[] => {
    if (!data || data.length === 0) return []

    const map = new Map<T[K], T>()

    // 将所有节点放入 map 中
    data.forEach((item) => {
        map.set(item[idField], { ...item, children: [] })
    })

    const roots: T[] = []
    const parentIds = new Set<T[K]>()

    // 遍历数据，构建树结构
    data.forEach((item) => {
        const parentId = item[parentIdField]
        const node = map.get(item[idField])

        if (node) {
            if (parentId !== undefined && parentId !== null) {
                const parent = map.get(parentId)
                if (parent) {
                    parent.children!.push(node)
                    parentIds.add(parentId)
                }
            } else {
                roots.push(node)
            }
        }
    })

    // 查找是否有数据的 parentId 在树中没有找到对应的父节点
    data.forEach((item) => {
        const parentId = item[parentIdField]
        if (parentId !== undefined && parentId !== null && !parentIds.has(parentId)) {
            const obj = map.get(item[idField])
            if (obj) {
                roots.push(obj)
            }
        }
    })

    return roots
}

/** 格式化文件大小 */
export const formatSize = (sizeInBytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let unitIndex = 0
    let size = sizeInBytes

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024
        unitIndex++
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`
}

/**
 * json 序列化
 * @param {*} text 字符串
 * @param {*} format 是否格式化
 */
export const textJsonStringify = (text: string, format: boolean) => {
    return JSON.stringify(JSON.parse(text), null, format ? 4 : undefined)
}

/** 通过组件地址 获取组件名称（以最后一级为组件名） */
export const getComponentName = (componentUrl: string) => {
    if (!componentUrl) return ''

    let componentName = ''
    const arr = componentUrl.split('/') || []
    componentName = arr[arr.length - 1]
    componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1)
    return componentName
}
