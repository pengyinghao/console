<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { watchEffect } from 'vue'
import { Icon } from '@/components'
import subMenu from './sub-menu.vue'
import Logo from './logo.vue'
import { useAppStore, useUserStore } from '@/store'
import { useLayout } from '@/composables/useLayout'
import { dataToTree } from '@/utils'
import { MenuOpenTypeEnum } from '@/core/enums/menuOpenTypeEnum'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const { isMobile } = useLayout()

watchEffect(() => {
    if (isMobile.value) {
        appStore.menuIsCollapse = true
    }
})

/** 菜单信息 */
const menus = dataToTree(
    userStore.originMenus.filter((item) => !item.hidden),
    'parentId'
)

const onSelect = (menuId: number) => {
    const menu = userStore.originMenus.find((item) => item.id === Number(menuId))

    if (!menu) return
    if (!menu.url) return window.$message.error('菜单没有url地址')

    const { openType, url } = menu
    if (openType === MenuOpenTypeEnum.ROUTE) {
        return router.push(url)
    }

    // 外链
    if (openType === MenuOpenTypeEnum.LINK) {
        return window.open(url, '_black')
    }
}
</script>
<template>
    <div>
        <logo />
        <el-scrollbar style="height: calc(100% - 56px)">
            <el-menu
                :default-active="route.meta!.id"
                :collapse="appStore.menuIsCollapse"
                class="aside-menu"
                @select="onSelect"
            >
                <template v-for="(routeItem, index) in menus" :key="index">
                    <el-menu-item
                        v-if="routeItem.children?.length === 0 && !routeItem.hidden"
                        class="aside-sub-menu"
                        :index="`${routeItem.id}`"
                    >
                        <Icon
                            v-if="routeItem.icon"
                            :name="routeItem.icon"
                            size="20"
                            class="mr-5px"
                        />
                        <template #title>{{ routeItem.name }}</template>
                    </el-menu-item>
                    <sub-menu v-else :menu="routeItem"></sub-menu>
                </template>
            </el-menu>
        </el-scrollbar>
    </div>
</template>
<style lang="scss" scoped>
:deep(.el-menu) {
    border-right: none;
}
</style>
<style lang="scss">
.dark {
    .aside-sub-menu:hover,
    .el-sub-menu__title:hover {
        background-color: var(--dark1) !important;
    }
}
</style>
