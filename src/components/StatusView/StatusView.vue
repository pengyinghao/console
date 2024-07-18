<script lang="ts" setup>
import { Status } from '@/core/enums/status'

type StatusType = 'primary' | 'enable' | 'success' | 'warning' | 'danger' | 'fail' | 'disabled' | 'gray'
const Colors: Record<StatusType, string> = {
    primary: 'var(--el-color-primary)',
    enable: 'var(--el-color-success)',
    success: 'var(--el-color-success)',
    warning: 'var(--el-color-warning)',
    danger: 'var(--el-color-error)',
    fail: 'var(--el-color-error)',
    disabled: 'var(--el-color-error)',
    gray: 'var(--el-color-info)'
}

const props = withDefaults(
    defineProps<{
        /** 是否显示点(跟随状态颜色) */
        dot?: boolean
        /** 类型 */
        type?: StatusType
        /** 状态  */
        status?: Status
        /**  状态颜色 */
        statusText?: string
    }>(),
    {
        dot: false,
        type: undefined,
        status: undefined,
        statusText: undefined
    }
)

const status = computed(() => props.type || (props.status === Status.ENABLE ? 'success' : 'fail'))
const statusText = computed(() => props.statusText || (props.status === 1 ? '启用' : '禁用'))
</script>
<template>
    <span :class="{ dot: dot }">
        <slot>
            {{ statusText }}
        </slot>
    </span>
</template>
<style lang="scss" scoped>
span {
    --color: v-bind(Colors[status]);
    --dot-size: 6px;
    @apply relative;
    color: var(--color);
}
.dot {
    padding-left: 12px;
    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        width: var(--dot-size);
        height: var(--dot-size);
        border-radius: 50%;
        background-color: var(--color);
    }
}
</style>
