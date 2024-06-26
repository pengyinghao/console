import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { RouteLocationNormalizedLoaded } from 'vue-router'

interface FixedMenu {
    name: string
    componentName: string
    path: string
}

export const useTabStore = defineStore('tab', () => {
    const fixedMenu = ref<FixedMenu[]>([])

    const fixedTabs = computed<string[]>(() => {
        return fixedMenu.value.map((item) => item.path) as string[]
    })
    const tabs = ref<RouteLocationNormalizedLoaded[]>([])

    /** 添加标签到集合 */
    const add = (tag: RouteLocationNormalizedLoaded, type?: string) => {
        if (tag.name === 'dashboard' || tabs.value.some((r) => r.path === tag.path)) return
        if (type === 'unshift') tabs.value.unshift(tag)
        else tabs.value.push({ ...tag })
    }

    /** 移除tab */
    const remove = (tab: RouteLocationNormalizedLoaded) => {
        tabs.value = tabs.value.filter((item) => item.path !== tab.path)
    }
    /** 关闭左侧标签 */
    const removeLeftTabs = (currentIndex: number) => {
        tabs.value = tabs.value.filter((item, index) => {
            if (!fixedTabs.value.includes(item.path)) {
                return index >= currentIndex
            }
            return true
        })
    }
    /** 移除右侧标签 */
    const removeRightTabs = (currentIndex: number) => {
        tabs.value = tabs.value.filter((item, index) => index <= currentIndex)
    }

    /** 移除其他标签 */
    const removeOtherTabs = (path: string) => {
        tabs.value = tabs.value.filter((item) => {
            return fixedTabs.value.includes(item.path) || item.path === path
        })
    }

    return {
        tabs,
        fixedMenu,
        fixedTabs,
        add,
        remove,
        removeLeftTabs,
        removeRightTabs,
        removeOtherTabs
    }
})
