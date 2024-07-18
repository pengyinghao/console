<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from 'vue-router'
import { useCompRef } from '@/composables/useCompRef'
import contextMenu from './contextMenu.vue'
import { eventEmitter } from '@/utils/eventEmitter'

const refScroll = ref<HTMLDivElement>()
const tabViewContainer = ref<HTMLElement>()
const pointerElement = ref<HTMLElement>()
const refContextMenu = useCompRef(contextMenu)

const tabStore = useTabStore()
const { tabs, fixedTabs } = toRefs(tabStore)

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

/** 滚动到目标元素 */
const scrollToTarget = () => {
    nextTick(() => {
        const target = document.querySelector('.scroll-item-active') as HTMLElement
        if (refScroll.value && target) {
            const containerWidth = refScroll.value.clientWidth
            const targetWidth = target.clientWidth
            const targetLeft = target.offsetLeft
            const scrollPosition = targetLeft - (containerWidth - targetWidth) / 2
            refScroll.value.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            })
        }
    })
}

/** 添加标签页 */
const addTab = () => {
    if (!fixedTabs.value.includes(route.path)) {
        tabStore.add(route)
        scrollToTarget()
    }
}
watch(route, addTab, { immediate: true })

// 点击标签页
const handleTabClick = (tab: RouteLocationNormalizedLoaded) => {
    router.push({ path: tab.path }).then(scrollToTarget)
}

/** 刷新页面 */
const handleRefresh = () => eventEmitter.emit('REFRESH_PAGE')

/** 返回首页 */
const handleHome = () => {
    router.push({ path: userStore.defaultRouterPath })
}

/** 关闭当前标签页 */
const onCloseCurrTab = (tab: RouteLocationNormalizedLoaded) => {
    tabStore.remove(tab)
    if (tabs.value.length === 0) {
        router.push(userStore.defaultRouterPath)
    } else {
        const lastTabPath = tabs.value[tabs.value.length - 1].path
        router.push(lastTabPath).then(scrollToTarget)
    }
    scrollToTarget()
}

/** 右键点击标签页 */
const tabItemRightClick = (tab: RouteLocationNormalizedLoaded, event: MouseEvent) => {
    pointerElement.value = event.target as HTMLElement
    refContextMenu.value?.openContextMenu(tab, tabViewContainer.value, event)
}

/** 点击外部隐藏右键菜单 */
onClickOutside(pointerElement, () => {
    refContextMenu.value?.hideContextMenu()
})
</script>

<template>
    <div ref="tabViewContainer" class="flex-y-center">
        <ul class="action">
            <li class="action-item">
                <Icon name="ic:round-refresh" size="1.6em" @click="handleRefresh" />
            </li>
            <li class="action-item">
                <Icon name="icon-park-outline:home" size="1.5em" @click="handleHome" />
            </li>
        </ul>

        <div ref="refScroll" class="scroll">
            <div
                v-for="tab in tabs"
                :key="tab.path"
                class="scroll-item"
                :class="{ 'scroll-item-active': tab.path === route.path }"
                @click="handleTabClick(tab)"
                @contextmenu.prevent="tabItemRightClick(tab, $event)"
            >
                <span class="scroll-item-text">{{ tab.meta?.name }}</span>
                <Icon
                    name="icon-park-outline:close-small"
                    size="15"
                    class="scroll-item-icon"
                    @click.prevent.stop="onCloseCurrTab(tab)"
                />
            </div>
        </div>
        <contextMenu ref="refContextMenu" @click="scrollToTarget" />
    </div>
</template>
<style lang="scss" scoped>
.action {
    @apply p-0 m-0 flex-y-center bg-white h-30px rounded-4px mr-10px;
    list-style: none;

    &-item {
        @apply relative plr-10px leading-30px cursor-pointer font-bold;
        transition: all 0.3s;
        color: var(--el-text-color-primary);
        &:not(:last-child)::after {
            display: block;
            content: '';
            position: absolute;
            right: 0;
            top: calc(50% - 5px);
            height: 10px;
            width: 1px;
            background-color: #eee;
        }

        &:hover {
            color: var(--el-color-primary);
        }
    }
}
.scroll {
    @apply flex-y-center overflow-hidden;

    &-item {
        color: var(--el-text-color-secondary);
        @apply flex-y-center bg-white rounded-4px plr-10px mr-10px h-30px cursor-pointer;
        &.scroll-item-active {
            @apply bg-primary c-white;
            .scroll-item-icon {
                opacity: 1 !important;
                width: 13px !important;
            }
        }
        &:last-of-type {
            @apply mr-0;
        }
        &:hover {
            .scroll-item-icon {
                @apply opacity-100 w-13px;
            }
        }
        &-icon {
            @apply w-0px ml-5px opacity-0 font-bold;
            transition: all 0.3s;
        }
    }
}
</style>
