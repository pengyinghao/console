<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { Table, TableColumn, PageContainer } from '@/components'
import RoleEdit from './components/roleEdit.vue'
import { setDefaultValue } from '@/utils'
import { useCompRef } from '@/composables/useCompRef'
import { fetchRoleInfos, Role, deleteRole } from '@/service/api/system/role'

const queryParams = reactive<{ name?: string }>({
    name: undefined
})

const reload = ref(false)
const handleQuery = () => {
    reload.value = true
}

const refRoleEdit = useCompRef(RoleEdit)
const handleEditRole = (id?: number) => {
    refRoleEdit.value?.showModal(id)
}
const handleModalClose = (refreshData: boolean) => {
    refreshData && handleQuery()
}

const handleDeleteRole = async (row: Role) => {
    await window.$messageBox.confirm('确定要删除该角色吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    await deleteRole(row.id)
    handleQuery()
}

const columns: TableColumn<Role>[] = [
    { label: '角色名称', prop: 'name' },
    {
        label: '备注',
        prop: 'remark',
        showOverflowTooltip: true,
        render: ({ row }) => setDefaultValue(row.remark)
    },
    { label: '创建时间', prop: 'createTime' },
    { label: '修改时间', prop: 'updateTime' },
    {
        label: '操作',
        prop: 'operation',
        width: 200,
        render: ({ row }) => {
            return (
                <div>
                    <a onclick={() => handleEditRole(row.id)}>修改</a>
                    <el-divider direction="vertical" />
                    <a onclick={() => handleDeleteRole(row)}>删除</a>
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
                <el-form-item label="角色名称：">
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
            :request-api="fetchRoleInfos"
            :request-params="queryParams"
            :pagination="false"
        >
            <template #header>
                <el-button type="primary" @click="handleEditRole()"> 新增 </el-button>
            </template>
        </Table>
        <role-edit ref="refRoleEdit" @close="handleModalClose"></role-edit>
    </PageContainer>
</template>

<style scoped></style>
