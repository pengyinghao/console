<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { StatusView, Table, TableColumn } from '@/components'
import {
    deleteDictType,
    fetchDictTypeInfos,
    updateDictTypeState,
    DictType
} from '@/service/api/system/dictionary'
import DictTypeEdit from './dictTypeEdit.vue'
import { useCompRef } from '@/composables/useCompRef'
import { setDefaultValue } from '@/utils'
import { useBusinessStore } from '@/store'
import { StateEnum } from '@/core/enums/stateEnum'

const reload = ref(false)
const queryParams = reactive({
    name: undefined,
    no: undefined
})

const refEditDictType = useCompRef(DictTypeEdit)
const handleQuery = () => {
    reload.value = true
}
const handleEditDictType = (id?: number) => {
    refEditDictType.value?.showModal(id)
}

const handleClose = (refreshData: boolean) => {
    refreshData && handleQuery()
}

const handleDeleteBtnClick = async (row: DictType) => {
    if (row.state === 1) return window.$message.warning('请先禁用后再删除')
    await window.$messageBox.confirm(
        <div>
            <p>确定要删除该字典吗?</p>
            <p class="c-red font-bold">删除后，该字典下的所有字典项都会被删除</p>
        </div>,
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
    await deleteDictType(row.id)
    handleQuery()
}

const handleUpdateUserState = async ({ state, id }: DictType) => {
    await window.$messageBox.confirm(
        `确定要${state === StateEnum.DISABLED ? '启用' : '禁用'}该用户吗?`,
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
    await updateDictTypeState(
        id,
        state === StateEnum.ENABLE ? StateEnum.DISABLED : StateEnum.DISABLED
    )
    handleQuery()
}

const emit = defineEmits(['navigation'])
const businessStore = useBusinessStore()
const handleNavigationDictInfo = (id: number) => {
    businessStore.dictTypeId = id
    emit('navigation')
}

const columns: TableColumn<DictType>[] = [
    { label: '类型编号', prop: 'no' },
    {
        label: '类型名称',
        prop: 'name',
        render: ({ row }) => {
            return <a onclick={() => handleNavigationDictInfo(row.id)}>{row.name}</a>
        }
    },
    {
        label: '状态',
        prop: 'state',
        render: ({ row }) => {
            return (
                <StatusView color={row.state === 0 ? 'danger' : 'success'}>
                    {row.state === 0 ? '禁用' : '启用'}
                </StatusView>
            )
        }
    },
    { label: '备注', prop: 'remark', render: ({ row }) => setDefaultValue(row.remark) },
    {
        label: '操作',
        prop: 'operation',
        width: 200,
        render: ({ row }) => {
            return (
                <div>
                    <a onclick={() => handleEditDictType(row.id)}>修改</a>
                    <el-divider direction="vertical" />
                    <a onclick={() => handleDeleteBtnClick(row)}>删除</a>
                    <el-divider direction="vertical" />
                    {
                        <a onclick={() => handleUpdateUserState(row)}>
                            {row.state === 0 ? '启用' : '禁用'}
                        </a>
                    }
                </div>
            )
        }
    }
]
</script>
<template>
    <el-form inline class="search-form" label-width="75px" @submit.prevent>
        <el-form-item label="编号">
            <el-input v-model="queryParams.no" clearable @change="handleQuery" />
        </el-form-item>
        <el-form-item label="名称">
            <el-input v-model="queryParams.name" clearable @change="handleQuery" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click.stop="handleQuery"> 查询 </el-button>
            <el-button> 重置 </el-button>
        </el-form-item>
    </el-form>
    <Table
        v-model:reload="reload"
        :columns="columns"
        :request-api="fetchDictTypeInfos"
        :request-params="queryParams"
    >
        <template #header>
            <el-button type="primary" @click="handleEditDictType()"> 新增 </el-button>
        </template>
    </Table>
    <dict-type-edit ref="refEditDictType" @close="handleClose"></dict-type-edit>
</template>

<style scoped></style>
