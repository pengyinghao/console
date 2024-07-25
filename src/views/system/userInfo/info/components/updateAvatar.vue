<script setup lang="ts">
import { VueCropper } from 'vue-cropper'
import { UploadRequestOptions } from 'element-plus'
import { useCompRef } from '@/composables/useCompRef'
import { upload } from '@/service/api/system/upload'
import { uploadUserAvatar } from '@/service/api/system/user'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const visible = ref(false)
const options = reactive({
    img: userStore.info.avatar, // 裁剪图片的地址
    autoCrop: true, // 是否默认生成截图框
    autoCropWidth: 200, // 默认生成截图框宽度
    autoCropHeight: 200, // 默认生成截图框高度
    fixedBox: true, // 固定截图框大小 不允许改变
    outputType: 'png', // 默认生成截图为PNG格式
    fileName: 'avatar'
})

const previews = reactive({ url: '', style: '' })
const realTime = (data) => {
    previews.url = data.url
    previews.style = data.img
}

const refCropper = useCompRef(VueCropper)
const handleChangeScale = (num = 1) => {
    refCropper.value?.changeScale(num)
}
const handleRotateLeft = () => {
    refCropper.value?.rotateLeft()
}
const handleRotateRight = () => {
    refCropper.value?.rotateRight()
}

const customRequest = (option: UploadRequestOptions) => {
    if (option.file.type.indexOf('image/') === -1) {
        window.$message.error('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。')
    } else {
        const reader = new FileReader()
        reader.readAsDataURL(option.file)
        reader.onload = () => {
            options.fileName = option.file.name
            options.img = reader.result as any
        }
    }
    return Promise.resolve()
}

/** 文件上传 */
const handleUpload = () => {
    refCropper.value.getCropBlob(async (data: Blob) => {
        const formData = new FormData()
        formData.append('file', data, options.fileName)
        const res = await upload(formData)
        await uploadUserAvatar(res)
        userStore.setAvatar(res)
        visible.value = false
    })
}

const showModal = () => {
    options.img = userStore.info.avatar
    visible.value = true
}
defineExpose({ showModal })
</script>
<template>
    <Modal v-model="visible" title="修改头像" width="800">
        <el-row>
            <el-col :xs="24" :md="12" :style="{ height: '350px' }">
                <vue-cropper
                    ref="refCropper"
                    :img="options.img"
                    :info="true"
                    :auto-crop="options.autoCrop"
                    :auto-crop-width="options.autoCropWidth"
                    :auto-crop-height="options.autoCropHeight"
                    :fixed-box="options.fixedBox"
                    :output-type="options.outputType"
                    @real-time="realTime"
                />
            </el-col>
            <el-col :xs="24" :md="12" :style="{ height: '350px' }">
                <div class="avatar-upload-preview">
                    <img :src="previews.url" :style="previews.style" />
                </div>
            </el-col>
        </el-row>
        <br />
        <el-row>
            <el-col :lg="2" :sm="3" :xs="3">
                <el-upload action="#" :http-request="customRequest" :show-file-list="false">
                    <el-button>
                        <span class="mr-4px">选择</span>
                        <Icon name="ep:upload-filled" :size="14"></Icon>
                    </el-button>
                </el-upload>
            </el-col>
            <el-col :lg="{ span: 1, offset: 2 }" :sm="2" :xs="2">
                <el-button @click="handleChangeScale(1)">
                    <template #icon>
                        <Icon name="ep:plus"></Icon>
                    </template>
                </el-button>
            </el-col>
            <el-col :lg="{ span: 1, offset: 1 }" :sm="2" :xs="2">
                <el-button @click="handleChangeScale(-1)">
                    <template #icon>
                        <Icon name="ep:minus"></Icon>
                    </template>
                </el-button>
            </el-col>
            <el-col :lg="{ span: 1, offset: 1 }" :sm="2" :xs="2">
                <el-button @click="handleRotateLeft()">
                    <template #icon>
                        <Icon name="ep:refresh-left"></Icon>
                    </template>
                </el-button>
            </el-col>
            <el-col :lg="{ span: 1, offset: 1 }" :sm="2" :xs="2">
                <el-button @click="handleRotateRight()">
                    <template #icon>
                        <Icon name="ep:refresh-right"></Icon>
                    </template>
                </el-button>
            </el-col>
            <el-col :lg="{ span: 2, offset: 6 }" :sm="2" :xs="2">
                <el-button type="primary" @click="handleUpload()">提 交</el-button>
            </el-col>
        </el-row>
    </Modal>
</template>

<style lang="scss" scoped>
.avatar-upload-preview {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;
}
</style>
