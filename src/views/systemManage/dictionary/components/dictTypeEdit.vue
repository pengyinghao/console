<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import {
    createDictType,
    fetchDictTypeDetail,
    updateDictType,
    UpdateDictTypeOption
} from '@/service/api/system/dictionary'
import Modal from '@/components/Modal/Modal.vue'

const emits = defineEmits<{
    (e: 'close', refreshData: boolean): void
}>()

const refForm = ref<FormInstance>()

const dataId = ref<number>()
const formData = reactive<UpdateDictTypeOption>({ no: '', name: '', state: 1, remark: undefined })

const rules = reactive<FormRules>({
    no: [{ required: true, message: '请输入编号', trigger: 'blur' }],
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})

const visible = ref(false)
const loading = ref(false)

/** 获取字典类型详情 */
const getDictTypeDetail = async () => {
    if (!dataId.value) return
    try {
        loading.value = true
        const result = await fetchDictTypeDetail(+dataId.value)
        formData.name = result.name
        formData.no = result.no
        formData.state = result.state
        formData.remark = result.remark
    } finally {
        loading.value = false
    }
}

const showModal = (id?: number) => {
    dataId.value = id
    id && getDictTypeDetail()
    visible.value = true
}

const close = (refreshData = false) => {
    refForm.value?.resetFields()
    dataId.value = undefined
    visible.value = false
    emits('close', refreshData)
}

const saveData = async () => {
    try {
        loading.value = true
        dataId.value
            ? await updateDictType(+dataId.value, formData)
            : await createDictType(formData)
        close(true)
    } finally {
        loading.value = false
    }
}

const handleConfirm = async () => {
    await refForm.value?.validate()
    saveData()
}

defineExpose({
    showModal
})
</script>

<template>
    <Modal
        v-model="visible"
        :title="dataId ? '修改字典类型' : '新增字典类型'"
        width="500"
        :before-close="() => close()"
    >
        <el-form
            ref="refForm"
            label-suffix="："
            :model="formData"
            :rules="rules"
            label-width="85px"
        >
            <el-form-item label="编号" prop="no">
                <el-input
                    v-model="formData.no"
                    :disabled="dataId"
                    maxlength="20"
                    placeholder="请输入编号"
                />
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="formData.name" maxlength="20" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="状态" prop="state">
                <el-radio-group v-model="formData.state">
                    <el-radio :value="1">启用</el-radio>
                    <el-radio :value="0">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input
                    v-model="formData.remark"
                    :rows="2"
                    type="textarea"
                    maxlength="100"
                    placeholder="请输入备注"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="() => close()">取消</el-button>
                <el-button type="primary" :loading="loading" @click="handleConfirm">确定</el-button>
            </div>
        </template>
    </Modal>
</template>

<style lang="scss" scoped></style>
