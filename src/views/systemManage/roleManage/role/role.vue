<script lang="ts" setup>
import { UploadRequestOptions, UploadUserFile } from 'element-plus'
import { ref } from 'vue'
import { upload, uploadMultiple } from '@/service/api/upload'

const handleCustomRequest = (options: UploadRequestOptions) => {
    upload(options.file).then((res) => {
        console.log(res)
    })
}

const fileList = ref<UploadUserFile[]>([])
const handleCustomRequest1 = () => {
    console.log('custom request')
}
const handleUpload = () => {
    uploadMultiple(fileList.value.map((item) => item.raw!))
}
</script>
<template>
    <div>
        <el-upload class="upload-demo" drag action="" multiple :http-request="handleCustomRequest">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            <template #tip>
                <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
            </template>
        </el-upload>

        <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :http-request="handleCustomRequest1"
        >
            <el-button type="primary">Click to upload</el-button>
            <template #tip>
                <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
            </template>
        </el-upload>
        <el-button @click="handleUpload">上传</el-button>
    </div>
</template>
