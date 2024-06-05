<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { Table, TableColumn, PageContainer, SearchOption, StatusView } from '@/components'
import { LoginInfo, fetchLoginInfoInfos } from '@/service/api/system/loginInfo'
defineOptions({ name: 'LoginInfo' })

const reload = ref(false)
const columns: TableColumn<LoginInfo>[] = [
    { label: '账号', prop: 'account' },
    { label: '登录IP', prop: 'loginIp' },
    { label: '登录地址', prop: 'loginAddr' },
    { label: '浏览器', prop: 'browser' },
    { label: '操作系统', prop: 'os' },
    {
        label: '登录状态',
        render: ({ row }) => {
            return <StatusView status={row.status}>{row.status === 'success' ? '成功' : '失败'}</StatusView>
        }
    },
    { label: '消息内容', prop: 'message' },
    { label: '登录时间', prop: 'loginTime', dateFormat: true }
]

const options = reactive<SearchOption[]>([
    { mode: 'input', label: '账号', field: 'account' },
    {
        mode: 'select',
        label: '登录状态',
        field: 'status',
        data: [
            { label: '成功', value: 'success' },
            { label: '失败', value: 'fail' }
        ]
    },
    {
        mode: 'date',
        type: 'daterange',
        label: '登录时间',
        field: 'login_date',
        startField: 'startTime',
        endField: 'endTime'
    }
])
</script>
<template>
    <PageContainer>
        <Table
            v-model:reload="reload"
            :columns="columns"
            :request-api="fetchLoginInfoInfos"
            :search="{ options: options, labelWidth: 110 }"
        >
        </Table>
    </PageContainer>
</template>

<style scoped></style>
