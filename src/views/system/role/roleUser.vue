<script setup lang="tsx">
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { PageContainer, Table, TableColumn, StatusView } from '@/components'
import { fetchRoleUser } from '@/service/api/system/role'
import { User } from '@/service/api/system/user'
import { setDefaultValue } from '@/utils'

const route = useRoute()
const queryParams = reactive({
    roleId: route.params.id
})

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
    { label: '手机', prop: 'phone' },
    {
        label: '邮箱',
        prop: 'email',
        width: 160,
        showOverflowTooltip: true,
        render: ({ row }) => setDefaultValue(row.email)
    }
]
</script>

<template>
    <PageContainer back>
        <template #header> 测试 </template>
        <Table
            :columns="columns"
            :request-api="fetchRoleUser"
            :request-params="queryParams"
        ></Table>
    </PageContainer>
</template>

<style scoped></style>
