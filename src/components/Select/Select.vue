<script lang="ts" setup>
import { SelectProps } from './selectType'
import { fetchDictTypeNo } from '@/service/api/system/dictionary'

const slots = useSlots()
const props = withDefaults(defineProps<SelectProps>(), {
    method: 'get',
    displayValue: 'value',
    displayLabel: 'label',
    data: [] as any
})

/** 是否重新加载 */
const reload = defineModel<boolean>('reload', { default: false })
const value = defineModel<string | number | undefined>({ required: true, default: undefined })

const options = ref<any[]>([])
const init = async () => {
    // 当有静态数据时，先加载静态数据
    if (props.data && props.data.length > 0) {
        options.value = props.data
        return true
    }

    if (props.typeNo) {
        const result = await fetchDictTypeNo(props.typeNo)
        options.value = result
        return true
    }

    if (props.requestApi) {
        const result = await props.requestApi(props.requestParams)
        options.value = result
        return true
    }

    throw new Error('请传入typeNo或url')
}

watchEffect(() => {
    if (reload.value) {
        init()
        reload.value = false
    }
})

const emit = defineEmits<{
    change: [value: any, row: any]
}>()
const handleChange = (val: any) => {
    const row = options.value.find((item) => item[props.displayValue] === val)
    emit('change', val, row)
}

onBeforeMount(() => {
    init()
})
</script>
<template>
    <el-select v-bind="$attrs" v-model="value" @change="handleChange">
        <template v-if="!$slots.default && !$slots.custom">
            <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item[displayLabel]"
                :value="item[displayValue]"
            >
            </el-option>
        </template>
        <!-- 通过后台返回数据，自定义渲染 -->
        <slot name="custom" :data="options"></slot>
        <slot v-for="name in Object.keys(slots)" :name="name"></slot>
    </el-select>
</template>
<style lang="scss">
.el-select__wrapper {
    font-size: var(--el-font-size-base);
}
</style>
