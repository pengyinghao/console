<script lang="ts" setup>
import { CSSProperties } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from 'vue-router'
import { useAppStore, useTabStore, useUserStore } from '@/store'

/** 操作类型 */
type Operation = 'closeCurr' | 'closeLeft' | 'closeRight' | 'closeOther'

interface ContentMenuOptions {
    icon: string
    label: string
    hide?: boolean
    operation: Operation
    disabled?: boolean
}

/** 定义菜单偏移量 */
const MENU_OFFSET_LEFT = 15
const MENU_OFFSET_TOP = 5
const MENU_WIDTH = 105

const emit = defineEmits<{
    click: [type: Operation]
}>()

const appStore = useAppStore()
const tabStore = useTabStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const { tabs } = toRefs(tabStore)

/** 定义选中的tab */
const selectTab = ref<RouteLocationNormalizedLoaded>()
/** 定义菜单是否可见 */
const contextMenuVisible = ref(false)

/** 定义菜单宽度 */
const menuWidth = computed(() => (appStore.menuIsCollapse ? appStore.menuCollapseWidth : appStore.menuWidth))

/** 定义菜单样式 */
const contextMenuStyle = ref<CSSProperties>({ left: '10px', top: '10px' })

/** 更新菜单样式 */
const updateContextMenuStyle = (event: MouseEvent, offsetLeft: number, offsetWidth: number) => {
    const maxLeft = offsetWidth - MENU_WIDTH
    const left = menuWidth.value + event.clientX - offsetLeft + MENU_OFFSET_LEFT
    contextMenuStyle.value.left = `${Math.min(left, maxLeft)}px`
    contextMenuStyle.value.top = `${event.clientY + MENU_OFFSET_TOP}px`
}

/** 打开菜单 */
const openContextMenu = (
    tab: RouteLocationNormalizedLoaded,
    tabViewContainer: HTMLElement | undefined,
    event: MouseEvent
) => {
    const offsetLeft = tabViewContainer?.getBoundingClientRect().left || 0
    const offsetWidth = tabViewContainer?.offsetWidth ?? 0

    updateContextMenuStyle(event, offsetLeft, offsetWidth)
    contextMenuVisible.value = true
    selectTab.value = tab
}

/** 定义菜单选项 */
const contentMenuOptions = computed<ContentMenuOptions[]>(() => {
    const currPath = selectTab.value?.path || ''
    const hide = tabStore.fixedTabs.includes(currPath)
    return [
        {
            icon: 'icon-park-outline:close-small',
            label: '关闭当前',
            hide,
            operation: 'closeCurr'
        },
        {
            icon: 'icon-park-outline:go-start',
            label: '关闭左侧',
            hide,
            operation: 'closeLeft',
            disabled: tabs.value.length > 0 && tabs.value[0].path === currPath
        },
        {
            icon: 'icon-park-outline:go-end',
            label: '关闭右侧',
            hide,
            operation: 'closeRight',
            disabled: tabs.value.length > 0 && tabs.value[tabs.value.length - 1].path === currPath
        },
        {
            icon: 'icon-park-outline:fullwidth',
            label: '关闭其他',
            operation: 'closeOther',
            disabled: tabs.value.length === 1
        }
    ]
})

/** 隐藏菜单 */
const hideContextMenu = () => {
    contextMenuVisible.value = false
}

/** 定义当前tab索引 */
const tabCurrentIndex = computed(() => {
    return tabs.value.findIndex((item) => item.path === selectTab.value?.path) || 0
})

/** 关闭左侧tab */
const closeLeftTab = () => {
    if (tabCurrentIndex.value > tabStore.fixedTabs.length - 1) {
        tabStore.removeLeftTabs(tabCurrentIndex.value)
    } else {
        window.$message.warning('左侧没有标签')
    }
}

/** 关闭右侧tab */
const closeRightTab = () => {
    if (tabCurrentIndex.value < tabs.value.length - 1) {
        tabStore.removeRightTabs(tabCurrentIndex.value)
    } else {
        window.$message.warning('右侧没有标签')
    }
}

/** 关闭其他tab */
const closeOther = () => {
    tabStore.removeOtherTabs(route.path)
}

/** 关闭当前tab */
const closeTabCurr = () => {
    tabStore.remove(selectTab.value as RouteLocationNormalizedLoaded)
    if (tabs.value.length === 0) {
        router.push(userStore.defaultRouterPath)
    } else {
        router.push(tabs.value[tabs.value.length - 1].path)
    }
}

/** 定义菜单操作 */
const contextOperation: Record<Operation, () => void> = {
    closeLeft: closeLeftTab,
    closeRight: closeRightTab,
    closeOther,
    closeCurr: closeTabCurr
}

/** 菜单点击事件 */
const onContextClick = (operation: Operation) => {
    contextOperation[operation]()
    emit('click', operation)
    if (tabs.value.length > 0) {
        router.push(tabs.value[tabs.value.length - 1].path)
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
            :style="{ ...contextMenuStyle, backgroundColor: 'var(--el-color-white)' }"
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
