<script lang="ts" setup>
import headerLeftContent from './header-left-content.vue'
import headerRightContent from './header-right-content.vue'
</script>
<template>
    <header>
        <header-left-content />
        <header-right-content />
    </header>
</template>
<style lang="scss" scoped>
:deep(.header-item) {
    @apply w-46px h-full flex-center plr-10px cursor-pointer;
}

:deep(.header-item:hover) {
    @apply bg-#eee dark:bg-dark-1;
}
</style>
