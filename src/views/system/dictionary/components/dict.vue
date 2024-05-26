<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { StatusView, Table, TableColumn } from '@/components'
import {
    Dict,
    DictType,
    deleteDict,
    fetchDictInfos,
    fetchDictTypeAllInfos,
    updateDictState
} from '@/service/api/system/dictionary'
import DictEdit from './dictEdit.vue'
import { setDefaultValue } from '@/utils'
import { useCompRef } from '@/composables/useCompRef'
import { useBusinessStore } from '@/store'
import { StateEnum } from '@/core/enums/stateEnum'
const queryParams = reactive<{ typeId?: number; name?: string }>({
    typeId: undefined,
    name: undefined
})

const reload = ref(false)

const handleQuery = () => {
    reload.value = true
}

const dictTypeInfos = ref<DictType[]>([])
/** 获取所有字典类型 */
const getDictTypeInfos = async () => {
    const res = await fetchDictTypeAllInfos()
    dictTypeInfos.value = res
}
getDictTypeInfos()

const refDictEdit = useCompRef(DictEdit)
const handleEditDict = (id?: number) => {
    refDictEdit.value?.showModal(id)
}
const handleModalClose = (refreshData: boolean) => {
    refreshData && handleQuery()
}

const handleDeleteDict = async (row: Dict) => {
    if (row.state === 1) return window.$message.warning('请先禁用后再删除')
    await window.$messageBox.confirm('确定要删除该字典吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    await deleteDict(row.id)
    handleQuery()
}

const handleUpdateDictState = async ({ state, id }: Dict) => {
    await window.$messageBox.confirm(
        `确定要${state === StateEnum.DISABLED ? '启用' : '禁用'}该用户吗?`,
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
    await updateDictState(id, state === StateEnum.DISABLED ? StateEnum.ENABLE : StateEnum.DISABLED)
    handleQuery()
}

const columns: TableColumn<Dict>[] = [
    { label: '字典名称', prop: 'name' },
    { label: '字典值', prop: 'value' },
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
        render: ({ row }) => {
            return (
                <div>
                    <a onclick={() => handleEditDict(row.id)}>修改</a>
                    <el-divider direction="vertical" />
                    <a onclick={() => handleDeleteDict(row)}>删除</a>
                    <el-divider direction="vertical" />
                    {
                        <a onclick={() => handleUpdateDictState(row)}>
                            {row.state === 0 ? '启用' : '禁用'}
                        </a>
                    }
                </div>
            )
        }
    }
]

const businessStore = useBusinessStore()
if (businessStore.dictTypeId) {
    queryParams.typeId = businessStore.dictTypeId
    businessStore.dictTypeId = undefined
}
handleQuery()
</script>
<template>
    <el-form inline class="search-form" label-width="75px" @submit.prevent>
        <el-form-item label="字典类型">
            <el-select
                v-model="queryParams.typeId"
                clearable
                style="width: 240px"
                @change="handleQuery"
                @clear="handleQuery"
            >
                <el-option
                    v-for="item in dictTypeInfos"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
            </el-select>
        </el-form-item>
        <el-form-item label="字典名称">
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
        :request-api="fetchDictInfos"
        :request-params="queryParams"
        :load="false"
    >
        <template #header>
            <el-button type="primary" @click="handleEditDict()"> 新增 </el-button>
        </template>
    </Table>
    <dict-edit ref="refDictEdit" @close="handleModalClose"></dict-edit>
</template>

<style scoped></style>
