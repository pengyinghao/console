<script lang="ts" setup>
import { useLayout } from '@/composables/useLayout'
import Breadcrumb from './components/breadcrumb.vue'
import { useAppStore } from '@/store'
const { isMobile } = useLayout()
defineOptions({ name: 'HeaderLeftContent' })

const appStore = useAppStore()
const onMenuCollapse = () => {
    appStore.menuIsCollapse = !appStore.menuIsCollapse
}
</script>

<template>
    <div class="flex-1 flex h-full items-center">
        <div class="header-item" @click="onMenuCollapse">
            <icon v-show="appStore.menuIsCollapse" name="icon-park-outline:indent-right" size="20" />
            <icon v-show="!appStore.menuIsCollapse" name="icon-park-outline:indent-left" size="20" />
        </div>
        <div class="ml-10px">
            <Breadcrumb v-if="!isMobile && appStore.showBreadcrumb" />
        </div>
    </div>
</template>
