<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Table, TableColumn, PageContainer, SearchOption } from '@/components'
import RoleEdit from './components/roleEdit.vue'
import { setDefaultValue } from '@/utils'
import { useCompRef } from '@/composables/useCompRef'
import { fetchRoleInfos, Role, deleteRole } from '@/service/api/system/role'
import Accredit from './components/accredit.vue'
defineOptions({ name: 'Role' })

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

const refAccredit = useCompRef(Accredit)
/** 角色授权 */
const handleAccredit = (row: Role) => {
    refAccredit.value?.show(row)
}

const router = useRouter()
/** 角色名称单击事件 */
const handleRoleUser = (row: Role) => {
    router.push(`/system/role-user/${row.id}`)
}

const columns: TableColumn<Role>[] = [
    { label: '角色标识', prop: 'code' },
    {
        label: '角色名称',
        prop: 'name',
        render: ({ row }) => {
            return <a onclick={() => handleRoleUser(row)}>{row.name}</a>
        }
    },
    {
        label: '角色描述',
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
                    {row.type === 'custom' ? (
                        <>
                            <a onclick={() => handleEditRole(row.id)}>修改</a>
                            <el-divider direction="vertical" />
                            <a onclick={() => handleDeleteRole(row)}>删除</a>
                            <el-divider direction="vertical" />
                        </>
                    ) : (
                        ''
                    )}
                    <a onclick={() => handleAccredit(row)}>授权</a>
                </div>
            )
        }
    }
]

const options = reactive<SearchOption[]>([{ mode: 'input', label: '角色名称', field: 'name' }])
</script>
<template>
    <PageContainer>
        <Table
            v-model:reload="reload"
            :columns="columns"
            :request-api="fetchRoleInfos"
            :pagination="false"
            :search="{ options: options, labelWidth: 110 }"
        >
            <template #header-left>
                <el-button type="primary" @click="handleEditRole()">新增</el-button>
            </template>
        </Table>
        <!-- 新增、编辑 -->
        <role-edit ref="refRoleEdit" @close="handleModalClose"></role-edit>
        <!-- 授权 -->
        <accredit ref="refAccredit"></accredit>
    </PageContainer>
</template>

<style scoped></style>
