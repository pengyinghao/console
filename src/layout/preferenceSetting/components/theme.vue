<script lang="ts" setup>
import { changeTheme } from '@/utils/theme'
import { themeColorList } from '@/core/config'

const appStore = useAppStore()

const handleColorClick = (color: string) => {
    appStore.theme = color
    changeTheme(color)
}
</script>

<template>
    <el-divider>系统主题</el-divider>
    <ul class="color-list">
        <li
            v-for="color in themeColorList"
            :key="color"
            class="flex-center w-full h-36px p-5px rounded-2px shadow cursor-pointer"
            :style="{ backgroundColor: color }"
            @click="handleColorClick(color)"
        >
            <Icon
                v-if="appStore.theme === color"
                name="ep:select"
                :class="[appStore.themeMode === 'dark' ? 'text-gray-700' : 'text-white']"
            />
        </li>
    </ul>
</template>

<style scoped>
.color-list {
    @apply m-0 p-0;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 12px 8px;

    @apply grid;
}
</style>
