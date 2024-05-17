<script lang="ts" setup>
import { StatusType, Colors } from './StatusTypes'
const props = withDefaults(
    defineProps<{
        dot?: boolean
        color: StatusType
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
    --color: v-bind(Colors[props.color]);
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
