<script setup lang="tsx">
import { SearchOption, TableColumn } from '@/components'
import ParamsEdit from './components/paramsEdit.vue'
import { setDefaultValue } from '@/utils'
import { useCompRef } from '@/composables/useCompRef'
import { fetchParamInfos, Param, deleteParam } from '@/service/api/system/param'
defineOptions({ name: 'Params' })

const reload = ref(false)

const handleQuery = () => {
    reload.value = true
}

const refParamsEdit = useCompRef(ParamsEdit)
const handleEditParam = (id?: number) => {
    refParamsEdit.value?.showModal(id)
}
const handleModalClose = (refreshData: boolean) => {
    refreshData && handleQuery()
}

const handleDeleteParam = async (row: Param) => {
    await window.$messageBox.confirm('确定要删除该参数吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    await deleteParam(row.id)
    handleQuery()
}

const columns: TableColumn<Param>[] = [
    { label: '参数名称', prop: 'name', width: 160 },
    { label: '参数键', prop: 'label' },
    { label: '参数值', prop: 'value' },
    {
        label: '备注',
        prop: 'remark',
        width: 160,
        showOverflowTooltip: true,
        render: ({ row }) => setDefaultValue(row.remark)
    },
    { label: '创建时间', prop: 'createTime', dateFormat: true, width: 160 },
    { label: '更新时间', prop: 'updateTime', dateFormat: true, width: 160 },
    {
        label: '操作',
        prop: 'operation',
        width: 100,
        fixed: 'right',
        render: ({ row }) => {
            return (
                <div>
                    <a onclick={() => handleEditParam(row.id)}>修改</a>
                    <el-divider direction="vertical" />
                    <a disabled={row.sys === 0} onclick={() => handleDeleteParam(row)}>
                        删除
                    </a>
                </div>
            )
        }
    }
]

const options = reactive<SearchOption[]>([{ mode: 'input', label: '参数名', field: 'name' }])
</script>
<template>
    <PageContainer>
        <Table
            v-model:reload="reload"
            :columns="columns"
            :request-api="fetchParamInfos"
            :search="{ options: options, labelWidth: 100 }"
        >
            <template #header-left>
                <el-button type="primary" @click="handleEditParam()"> 新增 </el-button>
            </template>
        </Table>
        <params-edit ref="refParamsEdit" @close="handleModalClose"></params-edit>
    </PageContainer>
</template>

<style scoped></style>
