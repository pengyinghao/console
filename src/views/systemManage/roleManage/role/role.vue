<script lang="ts" setup>
import { UploadRequestOptions } from 'element-plus'
import { upload } from '@/service/api/upload'

const handleCustomRequest = (options: UploadRequestOptions) => {
    upload(options.file).then((res) => {
        console.log(res)
    })
}
</script>
<template>
    <el-upload class="upload-demo" drag action="" multiple :http-request="handleCustomRequest">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
        <template #tip>
            <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
        </template>
    </el-upload>
</template>
