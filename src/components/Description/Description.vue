<script lang="ts" setup>
import { computed } from 'vue'

defineOptions({
    name: 'Description'
})
const props = withDefaults(
    defineProps<{
        /** 标题 */
        title?: string
        /** 中文label宽度 */
        zhLabelWidth: string | number
        /** 一行几列 */
        column?: number
        /** 是否显示底部border */
        bottomBorder?: boolean
    }>(),
    {
        title: '',
        enLabelWidth: '100',
        column: 3,
        bottomBorder: false
    }
)
// label宽度
const labelWidth = computed(() => {
    return `${props.zhLabelWidth}px`
})
</script>
<template>
    <div class="description" :style="{ borderWidth: bottomBorder ? '1px' : '0' }">
        <div v-if="title" class="description-title">
            {{ title }}
        </div>
        <div class="description-wrap">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.description {
    border-bottom: 0 solid var(--color-primary-light3);
    &-title {
        @apply text-14px font-bold mb-25px;
        color: #202832;
    }
    &-wrap {
        @apply w-full flex flex-wrap;
    }
}
.description :deep(.description-item) {
    @apply flex mb-10px;
}

.description :deep(.description-item-label) {
    flex-shrink: 0;
    width: v-bind(labelWidth);
    color: #808080;
}

.description :deep(.description-item-value) {
    color: var(--color-dark3);
    @apply ellipsis-text pr-16px flex-1;
}

.dark .description {
    border-color: var(--color-dark2);
    :deep(.description-item-value) {
        color: #fff;
    }
}
</style>
