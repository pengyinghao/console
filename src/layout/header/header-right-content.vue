<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core'
import Avatar from './components/avatar.vue'
import Message from './components/message.vue'
defineOptions({ name: 'HeaderRightContent' })

const { toggle } = useFullscreen()

/** 全屏、退出全屏单击事件 */
const onFullScreen = () => {
    toggle()
}
</script>
<template>
    <div class="flex items-center h-full">
        <div class="header-item" @click="onFullScreen">
            <Icon name="icon-park-outline:full-screen" size="18" class="c-[var(--el-text-color-regular)]"></Icon>
        </div>
        <message class="header-item" />
        <avatar class="header-item !w-auto" />
    </div>
</template>
