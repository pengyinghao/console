<script setup lang="tsx">
import { TableColumn, SearchOption } from '@/components'
import { Log, fetchLogInfos, ActionType } from '@/service/api/log/actionLog'
import { setDefaultValue } from '@/utils'
defineOptions({ name: 'ActionLog' })

const actionTypeText: Record<ActionType, string> = {
    create: '创建',
    update: '修改',
    delete: '删除',
    other: '其他'
}
const columns: TableColumn<Log>[] = [
    { label: '操作模块', prop: 'moduleName' },
    { label: '操作描述', prop: 'actionMessage', minWidth: 150 },
    {
        label: '操作类型',
        prop: 'actionType',
        showOverflowTooltip: true,
        render: ({ row }) => actionTypeText[row.actionType]
    },
    { label: '操作人员', prop: 'actionName', showOverflowTooltip: true, minWidth: 100 },
    { label: '操作地址', prop: 'actionIp', showOverflowTooltip: true },
    {
        label: '操作地点',
        prop: 'actionAddress',
        showOverflowTooltip: true,
        render: ({ row }) => setDefaultValue(row.actionAddress)
    },
    { label: '耗时(ms)', prop: 'costTime', showOverflowTooltip: true },
    { label: '操作日期', prop: 'createTime', showOverflowTooltip: true, dateFormat: true, minWidth: 160 }
]

const options = reactive<SearchOption[]>([
    { mode: 'input', label: '操作模块', field: 'moduleName' },
    { mode: 'input', label: '操作人', field: 'actionName' },
    {
        mode: 'select',
        label: '操作类型',
        field: 'actionType',
        data: [
            { label: '创建', value: 'create' },
            { label: '修改', value: 'update' },
            { label: '删除', value: 'delete' },
            { label: '其他', value: 'other' }
        ]
    },
    {
        mode: 'date',
        type: 'daterange',
        field: 'actionTime',
        startField: 'startDate',
        endField: 'endDate',
        label: '操作时间'
    }
])
</script>
<template>
    <PageContainer>
        <Table :columns="columns" :request-api="fetchLogInfos" :search="{ options: options, labelWidth: 110 }"> </Table>
    </PageContainer>
</template>
