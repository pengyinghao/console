<script lang="ts" setup>
import { useSlots, ref, onMounted } from 'vue'
interface PageContainerProps {
    /** 是否显示header */
    header?: boolean
    /** 内容区域是否有padding */
    contentPadding?: boolean
}

withDefaults(defineProps<PageContainerProps>(), {
    contentPadding: true,
    header: false,
    back: false
})
const slots = useSlots()
const refHeader = ref<HTMLElement>()
const contentHeight = ref('100%')
const setContentHeight = () => {
    if (refHeader.value) {
        contentHeight.value = `calc(100% - ${refHeader.value.offsetHeight + 10}px)`
    }
}
window.addEventListener('resize', () => {
    setContentHeight()
})

onMounted(() => {
    setContentHeight()
})
</script>
<template>
    <div class="app-container-inner">
        <div class="h-full flex flex-col rounded-5px flex-1 flex flex-col">
            <section v-if="slots.header" ref="refHeader" class="header">
                <div class="plr-16px pt-16px">
                    <slot name="header"></slot>
                </div>
            </section>
            <section class="content" :style="{ height: contentHeight }" :class="[contentPadding ? 'padding' : '']">
                <slot></slot>
            </section>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.app-container-inner {
    @apply h-full p-10px;
}
.header {
    @apply flex-y-center;
    // box-shadow: 0 1px 13px 1px rgba(62, 72, 160, 10%);
    transition: all 0.3s;

    @apply rounded-el-border light:bg-white dark:bg-dark1 mb-10px;
}

.content {
    @apply flex-1 flex flex-col flex-shrink-0 p-16px rounded-el-border light:bg-white dark:bg-dark1;
}

.padding {
    // box-shadow: 0 1px 13px 1px rgba(62, 72, 160, 10%);
    @apply plr-15px;
}

.go-back {
    @apply rounded-el-border flex-y-center ml-10px cursor-pointer hover:c-primary transition-base;
}
</style>
