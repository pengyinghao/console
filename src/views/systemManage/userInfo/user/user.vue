<script lang="tsx" setup>
import { reactive, ref } from 'vue'
import {
    PageContainer,
    StatusView,
    Table,
    TableColumn,
    MoreButton,
    MoreButtonProp
} from '@/components'
import {
    deleteUser,
    fetchUserInfos,
    updateUserState,
    updateUserFreeze,
    User
} from '@/service/api/system/user'
import AddUser from './components/addUser.vue'
import EditUser from './components/editUser.vue'
import { setDefaultValue } from '@/utils'
import { useCompRef } from '@/composables/useCompRef'

defineOptions({ name: 'User' })
const queryParams = reactive({
    name: undefined,
    account: undefined
})

const reload = ref(false)
const handleQuery = () => {
    reload.value = true
}

const refAddUser = useCompRef(AddUser)
const handleAddUser = () => {
    refAddUser.value?.showModal()
}

const refEditUer = useCompRef(EditUser)
const handleEditUser = (id: string) => {
    refEditUer.value?.showModal(id)
}

const handleClose = (refreshData: boolean) => {
    refreshData && handleQuery()
}

const handleDeleteBtnClick = async (row: User) => {
    await window.$messageBox.confirm('确定要删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    await deleteUser(row.id)
    handleQuery()
}

/** 启用、禁用 */
const handleUpdateUserState = async ({ id, state }: User) => {
    await window.$messageBox.confirm(`确定要${state === 0 ? '启用' : '禁用'}该用户吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    await updateUserState(id, state === 0 ? 1 : 0)
    handleQuery()
}

/** 更新用户冻结状态 */
const handleUpdateUserFreezeState = async ({ id, freeze }: User) => {
    await window.$messageBox.confirm(`确定要${freeze ? '解冻' : '冻结'}该用户吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    await updateUserFreeze(id, !freeze)
    handleQuery()
}

const moreButtons = (row: User) => {
    const moreButtons: MoreButtonProp[] = [
        { label: row.state === 0 ? '启用' : '禁用', command: 'state' },
        { label: row.freeze ? '解冻' : '冻结', command: 'freeze' }
    ]
    return moreButtons
}
const handleCommand = (command: string, row: User) => {
    if (command === 'state') {
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
        prop: 'state',
        render: ({ row }) => {
            return (
                <StatusView color={row.state === 0 ? 'danger' : 'success'}>
                    {row.state === 0 ? '禁用' : '启用'}
                </StatusView>
            )
        }
    },
    {
        label: '系统用户',
        prop: 'sysUser',
        render: ({ row }) => (row.freeze ? '是' : '否')
    },
    {
        label: '冻结',
        prop: 'freeze',
        render: ({ row }) => (row.freeze ? '是' : '否')
    },
    { label: '姓名', prop: 'name' },
    { label: '手机', prop: 'phone' },
    {
        label: '邮箱',
        prop: 'email',
        width: 160,
        showOverflowTooltip: true,
        render: ({ row }) => setDefaultValue(row.email)
    },
    { label: '创建时间', prop: 'createTime', width: 160 },
    { label: '修改时间', prop: 'updateTime', width: 160 },
    {
        label: '操作',
        prop: 'operation',
        width: 200,
        render: ({ row }) => {
            return (
                <div class="flex-y-center">
                    <a onclick={() => handleEditUser(row.id)}>修改</a>
                    <el-divider direction="vertical" />
                    <a onclick={() => handleDeleteBtnClick(row)}>删除</a>
                    <el-divider direction="vertical" />
                    <MoreButton
                        buttons={moreButtons(row)}
                        onCommand={(command) => handleCommand(command, row)}></MoreButton>
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
                <el-form-item label="姓名：">
                    <el-input v-model="queryParams.name" clearable @change="handleQuery" />
                </el-form-item>
                <el-form-item label="账号：">
                    <el-input v-model="queryParams.account" clearable @change="handleQuery" />
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
            :request-api="fetchUserInfos"
            :request-params="queryParams"
        >
            <template #header>
                <el-button type="primary" @click="handleAddUser()"> 新增用户 </el-button>
            </template>
        </Table>
        <AddUser ref="refAddUser" @close="handleClose"></AddUser>
        <EditUser ref="refEditUer" @close="handleClose"></EditUser>
    </PageContainer>
</template>
