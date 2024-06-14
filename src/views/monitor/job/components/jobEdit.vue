<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { ruleHelper } from '@/utils/ruleHelper'
import { Modal } from '@/components'
import { UpdateJobOption, JobImmediate, createJob, fetchJobDetail, updateJob } from '@/service/api/monitor/job'
import { isJSON, textJsonStringify } from '@/utils'

const emits = defineEmits<{
    (e: 'close', refreshData: boolean): void
}>()

const refForm = ref<FormInstance>()

const formData = reactive<UpdateJobOption>({
    name: '',
    service: '',
    cron: '',
    immediate: JobImmediate.no,
    remark: undefined
})

const { unable_contain_special, cron } = ruleHelper

const validateParams = (rule, value, callback) => {
    if (value) {
        if (isJSON(value)) {
            formData.params = textJsonStringify(value, true)
        } else {
            return callback(new Error('参数格式错误'))
        }
    }
    callback()
}
const rules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入任务名称', trigger: 'blur' },
        {
            type: 'string',
            pattern: unable_contain_special.reg,
            message: `任务名称${unable_contain_special.message}`
        }
    ],
    remark: [
        {
            type: 'string',
            pattern: unable_contain_special.reg,
            message: `角色描述${unable_contain_special.message}`
        }
    ],
    params: [{ validator: validateParams, trigger: 'blur' }],
    cron: [
        { required: true, message: '请输入cron表达式', trigger: 'blur' },
        {
            type: 'string',
            pattern: cron.reg,
            message: `定时表达式${cron.message}`,
            trigger: 'blur'
        }
    ],
    service: [{ required: true, message: '请选择任务执行服务' }]
})

const visible = ref(false)
const loading = ref(false)

/** 获取定时任务详情 */
const getJobDetail = async () => {
    if (!formData.id) return
    try {
        loading.value = true
        const result = await fetchJobDetail(formData.id)
        Object.assign(formData, result)
    } finally {
        loading.value = false
    }
}

const showModal = (id?: number) => {
    formData.id = id
    id && getJobDetail()
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
        formData.id ? await updateJob(formData) : await createJob(formData)
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
        <el-form ref="refForm" :model="formData" :rules="rules" label-width="110px">
            <el-form-item label="任务名称" prop="name">
                <el-input v-model="formData.name" maxlength="20" placeholder="请输入任务名称" />
            </el-form-item>
            <el-form-item label="定时表达式" prop="cron">
                <el-input v-model="formData.cron" maxlength="20" placeholder="请输入定时表达式" />
            </el-form-item>
            <el-form-item label="任务执行服务" prop="service">
                <el-input v-model="formData.service" maxlength="100" placeholder="请输入任务执行服务"></el-input>
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
            <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                    v-model="formData.startTime"
                    type="datetime"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    format="YYYY-MM-DD HH:mm:ss"
                    class="!w-full"
                />
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                    v-model="formData.endTime"
                    type="datetime"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    format="YYYY-MM-DD HH:mm:ss"
                    class="!w-full"
                />
            </el-form-item>
            <el-form-item label="立即执行" prop="immediate">
                <el-radio-group v-model="formData.immediate">
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
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
