<script lang="tsx" setup>
import { SearchControlOption } from './searchControl'
import { Select } from '../Select'
import { SearchProps } from './searchType'

const props = defineProps<SearchProps>()
const emit = defineEmits<{ search: [value: Record<string, any>] }>()

const handleQuery = () => {
    const formData: Record<string, any> = {}
    props.options.forEach((item) => {
        formData[item.field] = item.value
    })
    emit('search', formData)
}

const handleReset = () => {
    props.options.forEach((item) => {
        item.value = item.defaultValue || undefined
    })
}

const formItem = (item: SearchControlOption) => {
    if (item.render) return item.render(item, handleQuery)
    if (item.mode === 'input')
        return <el-input v-model={item.value} {...item} onchange={handleQuery}></el-input>
    if (item.mode === 'select')
        return (
            <Select v-model={item.value} {...item} onChange={handleQuery} class="w-200px"></Select>
        )
    if (item.mode === 'date')
        return (
            <el-date-picker v-model={item.value} {...item} onChange={handleQuery}></el-date-picker>
        )
}

const SearchForm = () => {
    return (
        <div class="search">
            <el-form v-bind="$attrs" inline>
                {props.options.map((item) => {
                    return <el-form-item label={item.label}>{formItem(item)}</el-form-item>
                })}
            </el-form>
            <el-button type="primary" onclick={handleQuery}>
                查询
            </el-button>
            <el-button onclick={handleReset}>重置</el-button>
        </div>
    )
}
</script>

<template>
    <SearchForm></SearchForm>
</template>
<style lang="scss" scoped>
.search {
    @apply flex;
}
</style>
