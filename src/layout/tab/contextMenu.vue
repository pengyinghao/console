<script lang="ts" setup>
import { CSSProperties, computed, ref, toRefs } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from 'vue-router'
import { Icon } from '@/components'
import { useAppStore, useTabStore, useUserStore } from '@/store'
type Operation = 'refresh' | 'closeCurr' | 'closeLeft' | 'closeRight' | 'closeOther'
/** 右键菜单选项 */
interface ContentMenuOptions {
    /** 图标 */
    icon: string
    /** 文本 */
    label: string
    /** 是否隐藏 */
    hide?: boolean
    /** 操作 */
    operation: Operation
    /** 是否禁用 */
    disabled?: boolean
}

const appStore = useAppStore()
const tabStore = useTabStore()
const router = useRouter()
const route = useRoute()
const { tabs } = toRefs(tabStore)
/** 选中tab */
const selectTab = ref<RouteLocationNormalizedLoaded>()
/** 右键菜单是否显示 */
const contextMenuVisible = ref(false)
/** 菜单宽度 */
const menuWidth = computed(() => (appStore.menuIsCollapse ? appStore.menuCollapseWidth : appStore.menuWidth))

/** 右键菜单样式 */
const contextMenuStyle = computed<CSSProperties>(() => {
    return {
        left: '10px',
        top: '10px'
    }
})

/** 打开tab右键菜单  */
const openContextMenu = (
    tab: RouteLocationNormalizedLoaded,
    tabViewContainer: HTMLElement | undefined,
    event: PointerEvent
) => {
    const offsetLeft = tabViewContainer?.getBoundingClientRect().left || 0 // 相对于视口的位置距离左侧像素
    const offsetWidth = tabViewContainer?.offsetWidth ?? 0 // tab container的宽度
    const maxLeft = offsetWidth - 105 // 最大偏移量

    const left = menuWidth.value + event.clientX - offsetLeft + 15 // 菜单左移距离
    if (left > maxLeft) contextMenuStyle.value.left = `${maxLeft}px`
    else contextMenuStyle.value.left = `${left}px`

    contextMenuStyle.value.top = `${event.clientY + 5}px`
    contextMenuVisible.value = true
    selectTab.value = tab
}

/** 右键菜单选项 */
const contentMenuOptions = computed<ContentMenuOptions[]>(() => {
    const currPath = selectTab.value?.path as string
    const hide = tabStore.fixedTabs.includes(currPath)
    const tabs = tabStore.tabs
    if (tabs.length === 0) return []
    return [
        { icon: 'ep:refresh', label: '刷新当前', operation: 'refresh' },
        {
            icon: 'icon-park-outline:close-small',
            label: '关闭当前',
            hide,
            operation: 'closeCurr',
            disabled: tabs.length === 1
        },
        {
            icon: 'icon-park-outline:go-start',
            label: '关闭左侧',
            hide,
            operation: 'closeLeft',
            disabled: tabs[0].path === currPath
        },
        {
            icon: 'icon-park-outline:go-end',
            label: '关闭右侧',
            operation: 'closeRight',
            disabled: tabs[tabs.length - 1].path === currPath
        },
        {
            icon: 'icon-park-outline:fullwidth',
            label: '关闭其他',
            operation: 'closeOther',
            disabled: tabs.length === 1
        }
    ]
})

/** 隐藏右键菜单 */
const hideContextMenu = () => {
    contextMenuVisible.value = false
}

const tabCurrentIndex = computed(() => {
    if (!selectTab.value) return 0
    return tabs.value.findIndex((item) => item.path === selectTab.value?.path) || 0
})

/** 关闭左侧标签 */
const closeLeftTab = () => {
    if (tabCurrentIndex.value > tabStore.fixedTabs.length) {
        tabStore.removeLeftTabs(tabCurrentIndex.value)
    } else {
        window.$message.warning(`左侧没有标签`)
    }
}

/** 关闭右侧标签 */
const closeRightTab = () => {
    if (tabCurrentIndex.value < tabs.value.length - 1) {
        tabStore.removeRightTabs(tabCurrentIndex.value)
    } else {
        window.$message.warning('右侧没有标签')
    }
}

const userStore = useUserStore()
/** 关闭所有标签 */
const closeOther = () => {
    tabStore.removeOtherTabs(route.path)
}

/** 关闭当前标签 */
const closeTabCurr = () => {
    tabStore.remove(selectTab.value as RouteLocationNormalizedLoaded)
    if (tabs.value.length === 0) {
        return router.push(userStore.defaultRouterPath)
    }
    return router.push(tabs.value[tabs.value.length - 1].path)
}

/** 刷新tab */
const refreshTab = () => {
    router.replace({
        path: `/redirect${selectTab.value?.path}`
    })
}

const contextOperation: Record<Operation, () => void> = {
    closeLeft: closeLeftTab,
    closeRight: closeRightTab,
    closeOther,
    closeCurr: closeTabCurr,
    refresh: refreshTab
}

/** 右键菜单单击事件 */
const onContextClick = (operation: Operation) => {
    contextOperation[operation]()
    if (operation !== 'refresh' && route.fullPath !== selectTab.value?.path) {
        const { path } = tabs.value[tabs.value.length - 1]
        router.push(path)
    }
    hideContextMenu()
}

defineExpose({
    openContextMenu,
    hideContextMenu
})
</script>

<template>
    <teleport to="body">
        <ul
            v-show="contextMenuVisible"
            :style="{
                ...contextMenuStyle,
                backgroundColor: 'var(--el-color-white)'
            }"
            class="context-menu"
        >
            <template v-for="item in contentMenuOptions" :key="item.icon">
                <li
                    v-show="!item.hide"
                    class="menu-item"
                    :class="{ disabled: item.disabled }"
                    @click="onContextClick(item.operation)"
                >
                    <Icon :name="item.icon" />
                    <span class="pl-8px">{{ item.label }}</span>
                </li>
            </template>
        </ul>
    </teleport>
</template>
<style lang="scss" scoped>
.context-menu {
    @apply w-140px fixed z-1000 rounded-4px z-99999 p-0 m-0;
    border-right: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 15%);
    color: var(--el-text-color-primary);
    .menu-item {
        transition: background-color var(--el-transition-duration);
        transition-timing-function: var(--el-transition-function-ease-in-out-bezier);

        @apply flex items-center  plr-15px h-35px cursor-pointer dark:bg-dark dark:c-white;

        &.disabled {
            @apply cursor-not-allowed;
            color: var(--el-text-color-placeholder);
        }

        &:not(.disabled):hover {
            background-color: var(--el-color-primary-light-9);
            @apply dark:bg-dark-1;
        }
    }
}
</style>
