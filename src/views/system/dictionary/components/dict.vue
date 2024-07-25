<script setup lang="tsx">
import { SearchOption, StatusView, TableColumn } from '@/components'
import {
    Dict,
    deleteDict,
    fetchDictInfos,
    fetchDictTypeAllInfos,
    updateDictState
} from '@/service/api/system/dictionary'
import DictEdit from './dictEdit.vue'
import { setDefaultValue } from '@/utils'
import { useCompRef } from '@/composables/useCompRef'
import { dictionaryPermission } from '@/types/permissions'
import { useBusinessStore } from '@/store'
const reload = ref(false)

const handleQuery = () => {
    reload.value = true
}

const refDictEdit = useCompRef(DictEdit)
const handleEditDict = (id?: number) => {
    refDictEdit.value?.showModal(id)
}
const handleModalClose = (refreshData: boolean) => {
    refreshData && handleQuery()
}

const handleDeleteDict = async (row: Dict) => {
    if (row.status === 1) return window.$message.warning('请先禁用后再删除')
    await window.$messageBox.confirm('确定要删除该字典吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    await deleteDict(row.id)
    handleQuery()
}

const handleUpdateDictState = async ({ status, id }: Dict) => {
    await window.$messageBox.confirm(`确定要${status === 0 ? '启用' : '禁用'}该用户吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    await updateDictState(id, status === 0 ? 1 : 0)
    handleQuery()
}

const columns: TableColumn<Dict>[] = [
    { label: '字典名称', prop: 'name' },
    { label: '字典值', prop: 'value' },
    {
        label: '状态',
        prop: 'status',
        render: ({ row }) => <StatusView status={row.status}></StatusView>
    },
    { label: '排序', prop: 'sort' },
    {
        label: '备注',
        prop: 'remark',
        showOverflowTooltip: true,
        render: ({ row }) => setDefaultValue(row.remark)
    },
    {
        label: '操作',
        prop: 'operation',
        width: 200,
        fixed: 'right',
        render: ({ row }) => {
            return (
                <div class="flex-y-center">
                    <div v-permission={dictionaryPermission.system_dict_edit}>
                        <a onclick={() => handleEditDict(row.id)}>修改</a>
                        <el-divider direction="vertical" />
                    </div>
                    <div v-permission={dictionaryPermission.system_dict_delete}>
                        <a onclick={() => handleDeleteDict(row)}>删除</a>
                        <el-divider direction="vertical" />
                    </div>
                    <a
                        v-permission={dictionaryPermission.system_dict_status}
                        onclick={() => handleUpdateDictState(row)}>
                        {row.status === 0 ? '启用' : '禁用'}
                    </a>
                </div>
            )
        }
    }
]

const businessStore = useBusinessStore()
const options = reactive<SearchOption[]>([
    {
        mode: 'select',
        requestApi: fetchDictTypeAllInfos,
        field: 'typeId',
        label: '字典类型',
        displayLabel: 'name',
        displayValue: 'id',
        value: businessStore.dictTypeId,
        valueLabel: businessStore.dictTypeName
    },
    { mode: 'input', label: '字典名称', field: 'name' }
])
businessStore.dictTypeId = undefined
businessStore.dictTypeName = undefined
</script>
<template>
    <Table
        v-model:reload="reload"
        :columns="columns"
        :request-api="fetchDictInfos"
        :load="false"
        :search="{ options, labelWidth: 110 }"
    >
        <template #header-left>
            <el-button v-permission="dictionaryPermission.system_dict_add" type="primary" @click="handleEditDict()">
                新增
            </el-button>
        </template>
    </Table>
    <dict-edit ref="refDictEdit" @close="handleModalClose"></dict-edit>
</template>

<style scoped></style>
