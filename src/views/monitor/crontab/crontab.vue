<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { Table, TableColumn, PageContainer, SearchOption, StatusView } from '@/components'
import crontabEdit from './components/crontabEdit.vue'
import { useCompRef } from '@/composables/useCompRef'
import { Crontab, fetchCrontabInfos, deleteCrontab } from '@/service/api/system/crontab'

defineOptions({ name: 'Crontab' })

const reload = ref(false)
const handleQuery = () => {
    reload.value = true
}

const refCrontabEdit = useCompRef(crontabEdit)
const handleEdit = (id?: number) => {
    refCrontabEdit.value?.showModal(id)
}
const handleModalClose = (refreshData: boolean) => {
    refreshData && handleQuery()
}

const handleDelete = async (row: Crontab) => {
    await window.$messageBox.confirm('确定要删除该任务吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    await deleteCrontab(row.id)
    handleQuery()
}

const columns: TableColumn<Crontab>[] = [
    { label: '名称', prop: 'code' },
    {
        label: '状态',
        render: ({ row }) => {
            return <StatusView status={row.status}>{row.status === 'enable' ? '禁用' : '启用'}</StatusView>
        }
    },
    {
        label: '任务类型',
        render: ({ row }) => {
            return row.type === 'sys' ? '系统' : '任务'
        }
    },
    { label: '定时表达式', prop: 'expression' },
    { label: '执行参数', prop: 'params' },
    { label: '描述', prop: 'remark' },
    { label: '最后执行时间', prop: 'lastExecTime' },
    {
        label: '操作',
        prop: 'operation',
        width: 200,
        render: ({ row }) => {
            return (
                <>
                    <a onclick={() => handleEdit(row.id)}>修改</a>
                    <el-divider direction="vertical" />
                    <a onclick={() => handleDelete(row)}>删除</a>
                    <el-divider direction="vertical" />
                </>
            )
        }
    }
]

const options = reactive<SearchOption[]>([
    { mode: 'input', label: '任务名称', field: 'name' },
    {
        mode: 'select',
        label: '任务类型',
        data: [
            { label: '系统', value: 'sys' },
            { label: '任务', value: 'task' }
        ]
    },
    {
        mode: 'select',
        label: '任务状态',
        data: [
            { label: '启用', value: 'enable' },
            { label: '禁用', value: 'disabled' }
        ]
    }
])
</script>
<template>
    <PageContainer>
        <Table
            v-model:reload="reload"
            :columns="columns"
            :request-api="fetchCrontabInfos"
            :search="{ options: options, labelWidth: 110 }"
        >
            <template #header-left>
                <el-button type="primary" @click="handleEdit()">创建</el-button>
            </template>
        </Table>
        <!-- 新增、编辑 -->
        <crontab-edit ref="refCrontabEdit" @close="handleModalClose"></crontab-edit>
    </PageContainer>
</template>

<style scoped></style>
