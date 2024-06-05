<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { ruleHelper } from '@/utils/ruleHelper'
import { Modal, Select } from '@/components'
import { UpdateCrontabOption, createCrontab, fetchCrontabDetail, updateCrontab } from '@/service/api/system/crontab'

const emits = defineEmits<{
    (e: 'close', refreshData: boolean): void
}>()

const refForm = ref<FormInstance>()

const formData = reactive<UpdateCrontabOption>({
    name: '',
    type: 'task',
    expression: '',
    remark: undefined
})

const { unable_contain_special, only_eng_udl } = ruleHelper
const rules = reactive<FormRules>({
    code: [
        { required: true, message: '请输入角色标识', trigger: 'blur' },
        { pattern: only_eng_udl.reg, message: `角色标识${only_eng_udl.message}` }
    ],
    name: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
        {
            type: 'string',
            pattern: unable_contain_special.reg,
            message: `角色名称${unable_contain_special.message}`
        }
    ],
    remark: [
        {
            type: 'string',
            pattern: unable_contain_special.reg,
            message: `角色描述${unable_contain_special.message}`
        }
    ]
})

const visible = ref(false)
const loading = ref(false)

/** 获取定时任务详情 */
const getCrontabDetail = async () => {
    if (!formData.id) return
    try {
        loading.value = true
        const result = await fetchCrontabDetail(formData.id)
        Object.assign(formData, result)
    } finally {
        loading.value = false
    }
}

const showModal = (id?: number) => {
    formData.id = id
    id && getCrontabDetail()
    visible.value = true
}

const close = (refreshData = false) => {
    refForm.value?.resetFields()
    visible.value = false
    emits('close', refreshData)
}

const saveData = async () => {
    try {
        loading.value = true
        formData.id ? await updateCrontab(formData) : await createCrontab(formData)
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
        :title="formData.id ? '修改定时任务' : '添加定时任务'"
        width="500"
        :before-close="() => close()"
    >
        <el-form ref="refForm" :model="formData" :rules="rules" label-width="100px">
            <el-form-item label="任务名称" prop="name">
                <el-input v-model="formData.name" maxlength="20" placeholder="请输入任务名称" />
            </el-form-item>
            <el-form-item label="任务类型" prop="type">
                <Select
                    v-model="formData.type"
                    :data="[
                        { label: '系统', value: 'sys' },
                        { label: '任务', value: 'task' }
                    ]"
                    placeholder="请选择任务类型"
                >
                </Select>
            </el-form-item>
            <el-form-item label="定时表达式" prop="expression">
                <el-input v-model="formData.expression" maxlength="20" placeholder="请输入定时表达式" />
            </el-form-item>
            <el-form-item label="任务执行参数" prop="params">
                <el-input
                    v-model="formData.params"
                    :rows="2"
                    type="textarea"
                    maxlength="200"
                    placeholder="请输入任务执行参数"
                />
            </el-form-item>
            <el-form-item label="任务描述" prop="remark">
                <el-input
                    v-model="formData.remark"
                    :rows="2"
                    type="textarea"
                    maxlength="200"
                    placeholder="请输入任务描述"
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
