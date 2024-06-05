<!-- eslint-disable no-console -->
<script lang="tsx" setup>
import { reactive, ref } from 'vue'
import { Search, SearchOption } from '@/components'
const options = reactive<SearchOption[]>([
    {
        mode: 'date',
        type: 'date',
        label: '日期',
        field: 'date',
        value: '2024-02-01'
    },
    {
        mode: 'date',
        type: 'daterange',
        label: '日期1',
        field: 'date1',
        startField: 'startDate',
        endField: 'endDate',
        startPlaceholder: '请选择开始日期',
        endPlaceholder: '请选择接结束日期'
    },
    {
        mode: 'select',
        label: '性别',
        field: 'sex',
        value: '1',
        valueLabel: '男',
        data: [
            { label: '男', value: '1' },
            { label: '女', value: '2' }
        ]
    },
    {
        mode: 'input',
        label: '姓名',
        field: 'name',
        value: '张三'
    },
    { mode: 'input', label: '账号', field: 'account' }
])

const handleSearch = (params: any) => {
    console.log(params)
}

const dynamicTags = ref(['Tag 1', 'Tag 2', 'Tag 3'])
const handleClose = () => {
    console.log(13)
}
</script>
<template>
    <div class="pt-20px pl-20px wh-full bg-white">
        <Search :options="options" @search="handleSearch"></Search>
        <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false" @close="handleClose">
            {{ tag }}
        </el-tag>
    </div>
</template>

<style lang="scss" scoped></style>
