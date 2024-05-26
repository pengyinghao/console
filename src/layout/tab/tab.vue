<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from 'vue-router'
import { ref, toRefs, watch } from 'vue'
import { Icon } from '@/components'
import contextMenu from './contextMenu.vue'
import { useTabStore, useUserStore } from '@/store'
import { useCompRef } from '@/composables/useCompRef'

const route = useRoute()
const router = useRouter()
const tabStore = useTabStore()

/** 添加tab */
const addTab = () => {
    tabStore.add(route)
}

watch(route, () => addTab(), { immediate: true })

const { fixedTabs, tabs } = toRefs(tabStore)
const tabViewContainer = ref<HTMLElement>()
const refContextMenu = useCompRef(contextMenu)
onClickOutside(tabViewContainer, () => {
    refContextMenu.value?.hideContextMenu()
})

const userStore = useUserStore()
/** 关闭当前选项卡 */
const onCloseCurrTab = (tab: RouteLocationNormalizedLoaded) => {
    tabStore.remove(tab)
    if (tabs.value.length === 0) {
        return router.push(userStore.defaultRouterPath)
    }
    const { path } = tabs.value[tabs.value.length - 1]
    router.push(path)
}
</script>
<template>
    <div ref="tabViewContainer">
        <el-scrollbar>
            <div class="tab-item-container">
                <router-link
                    v-for="tab in tabs"
                    :key="tab.path"
                    :to="tab.path"
                    :class="{ active: tab.path === route.path }"
                    class="tab-item"
                    @contextmenu.prevent="
                        refContextMenu?.openContextMenu(tab, tabViewContainer, $event)
                    "
                >
                    <span>{{ tab.meta?.name }}</span>
                    <Icon
                        v-if="!fixedTabs.includes(tab.path)"
                        name="ep:close"
                        size="12"
                        class="ml-5px"
                        @click.prevent.stop="onCloseCurrTab(tab)"
                    />
                </router-link>
            </div>
        </el-scrollbar>
        <contextMenu ref="refContextMenu" />
    </div>
</template>
<style lang="scss" scoped>
:deep(.el-scrollbar__wrap) {
    @apply flex items-center;
}

.tab-item-container {
    @apply flex items-center;
}

.tab-item {
    width: fit-content;
    color: var(--el-color-black);

    @apply ptb-6px plr-8px mr-8px min-w-50px flex-center  light:bg-#eee dark:bg-border-color rounded-5px cursor-pointer;
    @apply flex items-center decoration-none light:c-black dark:c-white;

    &.active {
        color: var(--el-color-primary);
    }

    .icon {
        color: var(--el-color-info);
        transition: all var(--el-transition-duration);
        transition-timing-function: var(--el-transition-function-ease-in-out-bezier);

        &:hover {
            color: var(--el-color-black);
        }
    }
}
</style>
