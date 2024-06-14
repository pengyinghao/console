<script lang="tsx" setup>
import { reactive, ref } from 'vue'
import { PageContainer, StatusView, Table, TableColumn, MoreButton, MoreButtonProp, SearchOption } from '@/components'
import { deleteUser, fetchUserInfos, updateUserState, updateUserFreeze, User } from '@/service/api/system/user'
import AddUser from './components/addUser.vue'
import EditUser from './components/editUser.vue'
import { setDefaultValue } from '@/utils'
import { useCompRef } from '@/composables/useCompRef'
defineOptions({ name: 'User' })

const reload = ref(false)
const handleQuery = () => {
    reload.value = true
}

const refAddUser = useCompRef(AddUser)
const handleAddUser = () => {
    refAddUser.value?.showModal()
}

const refEditUer = useCompRef(EditUser)
const handleEditUser = (id: number) => {
    refEditUer.value?.showModal(id)
}

const handleClose = (refreshData: boolean) => {
    refreshData && handleQuery()
}

const handleDeleteBtnClick = async (row: User) => {
    if (row.sysUser === 0) return
    await window.$messageBox.confirm('确定要删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    await deleteUser(row.id)
    handleQuery()
}

/** 启用、禁用 */
const handleUpdateUserState = async ({ id, status }: User) => {
    await window.$messageBox.confirm(`确定要${status === 0 ? '启用' : '禁用'}该用户吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    await updateUserState(id, status === 1 ? 0 : 1)
    handleQuery()
}

/** 更新用户冻结状态 */
const handleUpdateUserFreezeState = async ({ id, freeze }: User) => {
    await window.$messageBox.confirm(`确定要${freeze === 0 ? '解冻' : '冻结'}该用户吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    await updateUserFreeze(id, freeze === 0 ? 1 : 0)
    handleQuery()
}

const moreButtons = (row: User) => {
    const moreButtons: MoreButtonProp[] = [
        { label: row.status === 0 ? '启用' : '禁用', command: 'status' },
        { label: row.freeze ? '解冻' : '冻结', command: 'freeze' }
    ]
    return moreButtons
}
const handleCommand = (command: string, row: User) => {
    if (command === 'status') {
        handleUpdateUserState(row)
    } else {
        handleUpdateUserFreezeState(row)
    }
}

const columns: TableColumn<User>[] = [
    { label: '账号', prop: 'account' },
    { label: '编号', prop: 'no' },
    {
        label: '状态',
        render: ({ row }) => {
            return (
                <StatusView status={row.status === 0 ? 'danger' : 'success'}>
                    {row.status === 1 ? '启用' : '禁用'}
                </StatusView>
            )
        }
    },
    { label: '姓名', prop: 'name' },
    { label: '角色', prop: 'roleName' },
    {
        label: '系统用户',
        prop: 'sysUser',
        render: ({ row }) => (row.sysUser === 0 ? '是' : '否')
    },
    {
        label: '冻结',
        prop: 'freeze',
        render: ({ row }) => (row.freeze ? '是' : '否')
    },
    { label: '手机', prop: 'phone', showOverflowTooltip: true },
    {
        label: '邮箱',
        prop: 'email',
        width: 160,
        showOverflowTooltip: true,
        render: ({ row }) => setDefaultValue(row.email)
    },
    { label: '创建时间', prop: 'createTime', dateFormat: true, width: 160 },
    { label: '更新时间', prop: 'updateTime', dateFormat: true, width: 160 },
    {
        label: '操作',
        prop: 'operation',
        width: 200,
        render: ({ row }) => {
            return (
                <div class="flex-y-center">
                    <a onclick={() => handleEditUser(row.id)}>修改</a>
                    <el-divider direction="vertical" />
                    <a disabled={row.sysUser === 0} onclick={() => handleDeleteBtnClick(row)}>
                        删除
                    </a>
                    {row.sysUser === 1 ? (
                        <>
                            <el-divider direction="vertical" />
                            <MoreButton
                                buttons={moreButtons(row)}
                                onCommand={(command) => handleCommand(command, row)}></MoreButton>
                        </>
                    ) : (
                        ''
                    )}
                </div>
            )
        }
    }
]

const options = reactive<SearchOption[]>([
    { mode: 'input', label: '姓名', field: 'name' },
    { mode: 'input', label: '账号', field: 'account' }
])
</script>

<template>
    <PageContainer>
        <Table v-model:reload="reload" :columns="columns" :request-api="fetchUserInfos" :search="{ options: options }">
            <template #header-left>
                <el-button type="primary" @click="handleAddUser()"> 新增 </el-button>
            </template>
        </Table>
        <AddUser ref="refAddUser" @close="handleClose"></AddUser>
        <EditUser ref="refEditUer" @close="handleClose"></EditUser>
    </PageContainer>
</template>
