<script setup lang="tsx">
import { SearchOption } from '@/components/Search'
import { TableColumn } from '@/components/Table/type'
import { Upload, fetchUploadInfos } from '@/service/api/system/upload'
import { formatSize } from '@/utils'
defineOptions({ name: 'Upload' })

const columns: TableColumn<Upload>[] = [
    { label: '原文件名', prop: 'originalname', minWidth: 150, showOverflowTooltip: true },
    { label: '文件名', prop: 'fileName', minWidth: 100, showOverflowTooltip: true },
    { label: '文件地址', prop: 'url', minWidth: 200, showOverflowTooltip: true },
    {
        label: '大小',
        prop: 'size',
        width: 120,
        render: ({ row }) => {
            return formatSize(row.size)
        }
    },
    { label: '拓展名', prop: 'ext', width: 90 },
    { label: '上传时间', prop: 'createTime', dateFormat: true, width: 160 }
]

const options = reactive<SearchOption[]>([{ mode: 'input', label: '原文件名', field: 'originalname' }])
</script>
<template>
    <PageContainer>
        <Table :columns="columns" :search="{ labelWidth: 110, options }" :request-api="fetchUploadInfos"> </Table>
    </PageContainer>
</template>
