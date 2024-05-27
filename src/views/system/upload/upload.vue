<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { PageContainer, Table, TableColumn } from '@/components'
import { Upload, fetchUploadInfos } from '@/service/api/upload'
import { formatSize } from '@/utils'
defineOptions({ name: 'Upload' })

const reload = ref(false)
const queryParams = reactive({ originalname: '' })
const handleQuery = () => {
    reload.value = true
}

const columns: TableColumn<Upload>[] = [
    { label: '原文件名', prop: 'originalname' },
    { label: '文件名', prop: 'fileName' },

    { label: '文件地址', prop: 'url' },
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
</script>
<template>
    <PageContainer>
        <template #header>
            <el-form inline class="search-form" label-width="75px" @submit.prevent>
                <el-form-item label="原文件名">
                    <el-input v-model="queryParams.originalname" clearable @change="handleQuery" />
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
            :request-api="fetchUploadInfos"
            :request-params="queryParams"
        >
        </Table>
    </PageContainer>
</template>
