<script lang="ts" setup>
import { useAppStore } from '@/store'
defineOptions({
    name: 'Logo'
})
const appStore = useAppStore()
</script>
<template>
    <div class="logo">
        <Icon class="logo-icon" name="ep:element-plus" size="26" />
        <div v-show="!appStore.menuIsCollapse" class="logo-name pl-8px text-16px font-bold">
            <!-- 后台管理系统 -->
            vite
        </div>
    </div>
</template>
<style lang="scss" scoped>
.logo {
    @apply h-56px flex-center  nowrap-hidden bg-white dark:bg-dark;

    &-name {
        transition: none;
    }

    &-name,
    &-icon {
        color: var(--el-color-primary);
    }
}
</style>
