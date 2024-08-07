<script setup lang="tsx">
import { TableColumn, SearchOption, StatusView } from '@/components'
import JobEdit from './jobEdit.vue'
import { useCompRef } from '@/composables/useCompRef'
import { Job, fetchJobInfos, deleteJob, updateJobState, onceJob } from '@/service/api/monitor/job'
import { jobPermission } from '@/types/permissions'
import { useBusinessStore } from '@/store'

defineOptions({ name: 'Job' })

const reload = ref(false)
const handleQuery = () => {
    reload.value = true
}

const refJobEdit = useCompRef(JobEdit)
const handleEdit = (id?: number) => {
    refJobEdit.value?.showModal(id)
}
const handleModalClose = (refreshData: boolean) => {
    refreshData && handleQuery()
}

const handleDelete = async (row: Job) => {
    await window.$messageBox.confirm('确定要删除该任务吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    await deleteJob(row.id)
    handleQuery()
}

/** 停止、运行 */
const handleUpdateStatus = async (row: Job) => {
    await updateJobState(row.id, row.status === 0 ? 1 : 0)
    reload.value = true
}

/** 立即执行 */
const handleOnce = async (row: Job) => {
    await onceJob(row.id)
    reload.value = true
}

const emit = defineEmits(['navigation'])
const businessStore = useBusinessStore()
const handleNameClick = (row: Job) => {
    businessStore.jobName = row.name
    emit('navigation')
}

const columns: TableColumn<Job>[] = [
    { label: '名称', render: ({ row }) => <a onClick={() => handleNameClick(row)}>{row.name}</a> },
    {
        label: '状态',
        render: ({ row }) => {
            return (
                <StatusView dot type={row.status === 0 ? 'danger' : 'success'}>
                    {row.status === 0 ? '停止' : '运行中'}
                </StatusView>
            )
        }
    },
    { label: '定时表达式', prop: 'cron', minWidth: 100 },
    { label: '执行参数', prop: 'params', showOverflowTooltip: true },
    { label: '描述', prop: 'remark' },
    { label: '最后执行时间', prop: 'lastExecTime', dateFormat: true, width: 160 },
    {
        label: '操作',
        prop: 'operation',
        width: 200,
        fixed: 'right',
        render: ({ row }) => {
            return (
                <div class="flex-y-center">
                    <div v-permission={jobPermission.monitor_job_edit}>
                        <a onclick={() => handleEdit(row.id)}>修改</a>
                        <el-divider direction="vertical" />
                    </div>
                    <div v-permission={jobPermission.monitor_job_delete}>
                        <a onclick={() => handleDelete(row)}>删除</a>
                        <el-divider direction="vertical" />
                    </div>
                    <div v-permission={jobPermission.monitor_job_status}>
                        <a onclick={() => handleUpdateStatus(row)}>{row.status === 0 ? '启动' : '停止'}</a>
                        <el-divider direction="vertical" />
                    </div>
                    <a v-permission={jobPermission.monitor_job_execute} onclick={() => handleOnce(row)}>
                        立即执行
                    </a>
                </div>
            )
        }
    }
]

const options = reactive<SearchOption[]>([
    { mode: 'input', label: '任务名称', field: 'name' },
    {
        mode: 'select',
        field: 'status',
        label: '任务状态',
        data: [
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 }
        ]
    }
])
</script>
<template>
    <Table
        v-model:reload="reload"
        :columns="columns"
        :request-api="fetchJobInfos"
        :search="{ options: options, labelWidth: 110 }"
    >
        <template #header-left>
            <el-button v-permission="jobPermission.monitor_job_add" type="primary" @click="handleEdit()">
                创建
            </el-button>
        </template>
    </Table>
    <!-- 新增、编辑 -->
    <Job-edit ref="refJobEdit" @close="handleModalClose"></Job-edit>
</template>

<style scoped></style>
