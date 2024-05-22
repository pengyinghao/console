<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import Modal from '@/components/Modal/Modal.vue'
import {
    UpdateParam,
    fetchParamDetail,
    createParam,
    updateParam,
    Param
} from '@/service/api/system/param'
import { ruleHelper } from '@/utils/ruleHelper'

const emit = defineEmits<{
    close: [refreshData: boolean]
}>()

const refForm = ref<FormInstance>()

const formData = reactive<UpdateParam>({
    id: undefined,
    name: '',
    label: '',
    value: '',
    remark: undefined
})

const { unable_contain_special, only_letter_dot } = ruleHelper
const rules = reactive<FormRules<Param>>({
    name: [
        { required: true, message: '请输入参数名称', trigger: 'blur' },
        {
            type: 'string',
            pattern: unable_contain_special.reg,
            message: `参数名称${unable_contain_special.message}`
        }
    ],
    label: [
        { required: true, message: '请输入参数键', trigger: 'blur' },
        {
            type: 'string',
            pattern: only_letter_dot.reg,
            message: `参数键${only_letter_dot.message}`
        }
    ],
    value: [{ required: true, message: '请输入参数值', trigger: 'blur' }],
    remark: [
        {
            type: 'string',
            pattern: unable_contain_special.reg,
            message: `备注${unable_contain_special.message}`
        }
    ]
})

const visible = ref(false)
const loading = ref(false)

/** 获取参数详情 */
const getParamDetail = async () => {
    if (!formData.id) return
    try {
        loading.value = true
        const result = await fetchParamDetail(formData.id)
        Object.assign(formData, result)
    } finally {
        loading.value = false
    }
}

const showModal = (id?: number) => {
    formData.id = id
    id && getParamDetail()
    visible.value = true
}

const close = (refreshData = false) => {
    refForm.value?.resetFields()
    visible.value = false
    emit('close', refreshData)
}

const saveData = async () => {
    try {
        loading.value = true
        formData.id ? await updateParam(formData) : await createParam(formData)
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
        :title="formData.id ? '修改参数信息' : '新增参数信息'"
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
            <el-form-item label="参数名称" prop="name">
                <el-input v-model="formData.name" maxlength="20" placeholder="请输入参数名称" />
            </el-form-item>
            <el-form-item label="参数键" prop="label">
                <el-input v-model="formData.label" maxlength="20" placeholder="请输入参数键" />
            </el-form-item>
            <el-form-item label="参数值" prop="value">
                <el-input v-model="formData.value" maxlength="20" placeholder="请输入参数值" />
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
