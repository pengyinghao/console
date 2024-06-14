<script lang="ts" setup>
enum Colors {
    primary = 'var(--el-color-primary)',
    enable = 'var(--el-color-success)',
    success = 'var(--el-color-success)',
    warning = 'var(--el-color-warning)',
    danger = 'var(--el-color-error)',
    fail = 'var(--el-color-error)',
    disabled = 'var(--el-color-error)',
    gray = 'var(--el-color-info)'
}

type Status = keyof typeof Colors

const props = withDefaults(
    defineProps<{
        dot?: boolean
        status: Status
    }>(),
    {
        dot: false
    }
)
</script>
<template>
    <span :class="{ dot: dot }">
        <slot></slot>
    </span>
</template>
<style lang="scss" scoped>
span {
    --color: v-bind(Colors[props.status]);
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
