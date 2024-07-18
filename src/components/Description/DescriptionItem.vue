<script lang="ts" setup>
import { getCurrentInstance } from 'vue'
import { setDefaultValue } from '@/utils'
defineOptions({
    name: 'DescriptionItem'
})
const props = withDefaults(
    defineProps<{
        /** 显示文本 */
        label: string
        /** 显示值 */
        value?: string | number
        /** 站位几列 */
        span?: number | string
    }>(),
    {
        value: '',
        span: 1
    }
)

/** 获取父元素设置的列 */
const columnCounter = computed((): number => {
    const parentProps = getCurrentInstance()?.parent?.props
    if (parentProps) {
        return parentProps.column as number
    }
    return 3
})

/** 得到每列的宽度 */
const colWidth = computed(() => {
    return (100 / columnCounter.value) * Number(props.span)
})
</script>

<template>
    <div class="description-item" :style="{ width: colWidth + '%' }">
        <div class="description-item-label">{{ label }}</div>
        <div class="description-item-value">
            <slot>{{ setDefaultValue(value) }}</slot>
        </div>
    </div>
</template>
