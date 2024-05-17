import { defineStore } from 'pinia'
import { ref } from 'vue'
import { RouteRecordRaw } from 'vue-router'

export const useTabStore = defineStore('tab', () => {
    const fixedTabs = ref<string[]>([])
    const tabs = ref<RouteRecordRaw[]>([])

    /** 添加标签到集合 */
    const add = (tag: RouteRecordRaw, type?: string) => {
        if (tag.name === 'dashboard' || tabs.value.some((r) => r.path === tag.path)) return
        if (type === 'unshift') tabs.value.unshift(tag)
        else tabs.value.push(tag)
    }

    /** 移除tab */
    const remove = (tab: RouteRecordRaw) => {
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
    /** 移除所有标签 */
    const removeAllTabs = () => {
        tabs.value = tabs.value.filter((item) => {
            return fixedTabs.value.includes(item.path)
        })
    }

    return {
        tabs,
        fixedTabs,
        add,
        remove,
        removeLeftTabs,
        removeRightTabs,
        removeAllTabs
    }
})
