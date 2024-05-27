<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { PageContainer, Table, TableColumn } from '@/components'
import ParamsEdit from './components/paramsEdit.vue'
import { setDefaultValue } from '@/utils'
import { useCompRef } from '@/composables/useCompRef'
import { fetchParamInfos, Param, deleteParam } from '@/service/api/system/param'
// eslint-disable-next-line vue/no-reserved-component-names
defineOptions({ name: 'Param' })
const queryParams = reactive<{ name?: string }>({
    name: undefined
})

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
    { label: '参数名称', prop: 'name' },
    { label: '参数键', prop: 'label' },
    { label: '参数值', prop: 'value' },
    {
        label: '备注',
        prop: 'remark',
        showOverflowTooltip: true,
        render: ({ row }) => setDefaultValue(row.remark)
    },
    { label: '创建时间', prop: 'createTime', dateFormat: true },
    { label: '更新时间', prop: 'updateTime', dateFormat: true },
    {
        label: '操作',
        prop: 'operation',
        width: 200,
        render: ({ row }) => {
            return (
                <div>
                    <a onclick={() => handleEditParam(row.id)}>修改</a>
                    <el-divider direction="vertical" />
                    <a disabled={row.sys} onclick={() => handleDeleteParam(row)}>
                        删除
                    </a>
                </div>
            )
        }
    }
]
</script>
<template>
    <PageContainer>
        <template #header>
            <el-form inline class="search-form" label-width="75px" @submit.prevent>
                <el-form-item label="参数名">
                    <el-input v-model="queryParams.name" clearable @change="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click.stop="handleQuery"> 查询 </el-button>
                    <el-button> 重置 </el-button>
                </el-form-item>
            </el-form>
        </template>
        <Table
            v-model:reload="reload"
            :columns="columns"
            :request-api="fetchParamInfos"
            :request-params="queryParams"
        >
            <template #header>
                <el-button type="primary" @click="handleEditParam()"> 新增 </el-button>
            </template>
        </Table>
        <params-edit ref="refParamsEdit" @close="handleModalClose"></params-edit>
    </PageContainer>
</template>

<style scoped></style>
