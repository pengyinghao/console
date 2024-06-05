<script setup lang="tsx">
import { reactive } from 'vue'
import { Table, TableColumn, PageContainer, SearchOption } from '@/components'
import { fetchOnlineUserInfos, OnlineUser } from '@/service/api/monitor/online'
defineOptions({ name: 'Online' })

const columns: TableColumn<OnlineUser>[] = [
    { label: '会话编号', prop: 'uuid', width: 250 },
    { label: '账号', prop: 'account' },
    { label: '姓名', prop: 'name' },
    { label: '登录IP', prop: 'loginIp' },
    { label: '登录地址', prop: 'loginAddr' },
    { label: '浏览器', prop: 'browser' },
    { label: '操作系统', prop: 'os' },
    { label: '登录时间', prop: 'loginTime', width: 160, dateFormat: true }
]

const options = reactive<SearchOption[]>([
    { mode: 'input', label: '账号', field: 'account' },
    { mode: 'input', label: '姓名', field: 'name' },
    { mode: 'input', label: '登录地址', field: 'loginAddr' }
])
</script>
<template>
    <PageContainer>
        <Table :columns="columns" :request-api="fetchOnlineUserInfos" :search="{ options: options, labelWidth: 110 }">
        </Table>
    </PageContainer>
</template>
