<script lang="ts" setup>
import { CSSProperties, computed } from 'vue'
import { useAppStore, useTabStore } from '@/store'
import Header from './header/header.vue'
import Menu from './menu/menu.vue'
import Tab from './tab/tab.vue'
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
/** 内容区域样式 */
const contentStyle = computed<CSSProperties>(() => {
    return {
        paddingTop: appStore.showTab ? '100px' : '56px'
    }
})
</script>
<template>
    <div class="app-container">
        <Header class="app-container-header">header</Header>
        <Tab v-show="appStore.showTab" class="app-container-tab"></Tab>
        <Menu class="app-container-aside"></Menu>
        <main class="app-container-body" :style="contentStyle">
            <router-view v-slot="{ Component }">
                <transition :name="!appStore.disableAnimation ? appStore.animationType : ''" mode="out-in">
                    <keep-alive v-if="appStore.keepAlive" :include="keepAliveNames" :max="appStore.keepAliveCounter">
                        <component :is="Component" :key="$route.path" />
                    </keep-alive>
                    <component :is="Component" v-else />
                </transition>
            </router-view>
        </main>
    </div>
</template>
<style lang="scss" scoped>
.app-container {
    @apply wh-full relative;

    &-header {
        box-shadow: 0 1px 2px #00152914;

        @apply fixed  h-56px z-1001 flex flex-y-center justify-between bg-white dark:bg-dark;
    }

    &-tab {
        box-shadow: 0 1px 2px #00152914;

        @apply fixed top-56px   w-full z-1000 h-44px flex items-center plr-15px bg-white   dark:bg-dark;
        @apply whitespace-nowrap;
    }

    &-aside {
        border-right: none !important;
        width: v-bind(sideWidth);
        box-shadow: 2px 0 8px #1d23290d;
        transition: all var(--el-transition-duration) ease-in-out;

        @apply fixed left-0 top-0 h-full  z-1002  light:bg-white dark:bg-dark;
    }

    &-body {
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
    .app-container-header {
        box-shadow: 0 1px 2px #fcfdfd14;
    }

    .app-container-tab {
        box-shadow: 0 1px 2px #e0e3e60d;
    }

    .app-container-aside {
        box-shadow: 2px 0 8px #e0e3e60d;
    }
}
</style>
, computed
