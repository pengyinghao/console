<script setup lang="tsx">
import { TableColumn, SearchOption, StatusView } from '@/components'
import { JobLog, fetchJobLogInfos } from '@/service/api/monitor/job'
defineOptions({ name: 'JobLog' })

const columns: TableColumn<JobLog>[] = [
    { label: '任务名称', prop: 'jobName' },
    {
        label: '执行状态',
        render: ({ row }) => {
            return (
                <StatusView type={row.status === 0 ? 'danger' : 'success'}>
                    {row.status === 0 ? '失败' : '成功'}
                </StatusView>
            )
        }
    },
    { label: '错误日志', prop: 'err', showOverflowTooltip: true },
    {
        label: '消耗时间',
        render: ({ row }) => <span>{row.consumeTime}(ms)</span>
    },
    { label: '执行时间', prop: 'createTime', dateFormat: true }
]

const businessStore = useBusinessStore()
const options = reactive<SearchOption[]>([
    { mode: 'input', label: '任务名称', field: 'jobName', value: businessStore.jobName },
    {
        mode: 'select',
        field: 'status',
        label: '执行状态',
        data: [
            { label: '成功', value: 1 },
            { label: '失败', value: 0 }
        ]
    }
])
businessStore.jobName = undefined
</script>
<template>
    <Table :columns="columns" :request-api="fetchJobLogInfos" :search="{ options: options, labelWidth: 110 }"> </Table>
</template>

<style scoped></style>
