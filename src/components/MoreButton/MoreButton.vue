<script setup lang="ts">
import { Icon } from '@/components'
export interface MoreButtonProp {
    label: string | (() => void)
    /** 自定义图标 */
    icon?: string
    /** 派发到command回调函数的指令参数 */
    command: string
    /** 是否显示分隔符 */
    divided?: boolean
    /** 是否禁用 */
    disabled?: boolean
}
interface Props {
    buttons: MoreButtonProp[]
}
defineProps<Props>()
</script>
<template>
    <el-dropdown v-bind="$attrs">
        <span class="flex-y-center cursor-pointer c-primary">
            <slot>更多</slot>
            <slot name="icon">
                <Icon name="mingcute:down-line"></Icon>
            </slot>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item
                    v-for="(item, index) in buttons"
                    :key="index"
                    :disabled="item.disabled || false"
                    :divided="item.divided || false"
                    :command="item.command"
                >
                    {{ item.label }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<style scoped></style>
