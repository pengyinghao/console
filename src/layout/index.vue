<script lang="ts" setup>
import Header from './header/header.vue'
import Menu from './menu/menu.vue'
import Tab from './tab/tab.vue'
import { eventEmitter } from '@/utils/eventEmitter'
import { useAppStore, useTabStore } from '@/store'
defineOptions({
    name: 'Layout'
})
const appStore = useAppStore()
const tabStore = useTabStore()

const keepAliveNames = computed(() => {
    const names: string[] = []
    tabStore.tabs.forEach((it) => {
        names.push(it.name as string)
    })
    tabStore.fixedMenu.forEach((it) => {
        names.push(it.componentName as string)
    })
    return names
})
/** 菜单宽度 */
const sideWidth = computed(() => {
    return appStore.menuIsCollapse ? `${appStore.menuCollapseWidth}px` : `${appStore.menuWidth}px`
})

const key = ref(1)
eventEmitter.on('REFRESH_PAGE', () => {
    key.value = Date.now()
})
</script>
<template>
    <div class="app-container">
        <Header class="app-container-header"></Header>
        <Tab class="app-container-tab"></Tab>
        <Menu class="app-container-aside"></Menu>
        <main class="app-container-body">
            <router-view v-slot="{ Component }">
                <transition :name="!appStore.disableAnimation ? appStore.animationType : ''" mode="out-in">
                    <keep-alive :key="key" :include="keepAliveNames" :max="appStore.keepAliveCounter">
                        <component :is="Component" :key="$route.path" />
                    </keep-alive>
                </transition>
            </router-view>
        </main>
    </div>
</template>
<style lang="scss" scoped>
.app-container {
    --header-height: 56px;
    --tab-height: 30px;
    @apply wh-full relative;

    &-header {
        height: var(--header-height);
        @apply fixed  z-1001 flex flex-y-center justify-between bg-white dark:bg-dark;
    }

    &-tab {
        top: var(--header-height);
        @apply ptb-10px fixed w-full z-1000 flex items-center plr-10px light:bg-[#f7f7f7] dark:bg-[#1a1a1c];
        @apply whitespace-nowrap;
    }

    &-aside {
        border-right: none !important;
        width: v-bind(sideWidth);
        transition: all var(--el-transition-duration) ease-in-out;
        box-shadow: 2px 0 8px rgba(29, 35, 41, 0.05);

        @apply fixed left-0 top-0 h-full  z-1002  light:bg-white dark:bg-dark;
    }

    &-body {
        padding-top: calc(var(--header-height) + var(--tab-height) + 10px);
        @apply h-full;
    }

    &-header,
    &-tab,
    &-body {
        margin-left: v-bind(sideWidth);
        width: calc(100% - v-bind(sideWidth));
        transition: all var(--el-transition-duration) ease-in-out;
    }
}

.dark {
    .app-container-aside {
        box-shadow: 2px 0 8px rgba(29, 35, 41, 0.5);
    }
}
</style>
, computed
