<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import Modal from '@/components/Modal/Modal.vue'
import { RoleOption, createRole, fetchRoleDetail, updateRole } from '@/service/api/system/role'
import { ruleHelper } from '@/utils/ruleHelper'

const emits = defineEmits<{
    (e: 'close', refreshData: boolean): void
}>()

const refForm = ref<FormInstance>()

const formData = reactive<RoleOption>({
    id: undefined,
    name: '',
    code: '',
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

/** 获取角色详情 */
const getRoleDetail = async () => {
    if (!formData.id) return
    try {
        loading.value = true
        const result = await fetchRoleDetail(formData.id)
        Object.assign(formData, result)
    } finally {
        loading.value = false
    }
}

const showModal = (id?: number) => {
    formData.id = id
    id && getRoleDetail()
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
        formData.id ? await updateRole(formData) : await createRole(formData)
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
    <Modal v-model="visible" :title="formData.id ? '修改角色' : '新增角色'" width="500" :before-close="() => close()">
        <el-form ref="refForm" :model="formData" :rules="rules" label-width="85px">
            <el-form-item label="角色标识" prop="50">
                <el-input v-model="formData.code" maxlength="50" placeholder="请输入角色标识" />
            </el-form-item>
            <el-form-item label="角色名称" prop="name">
                <el-input v-model="formData.name" maxlength="20" placeholder="请输入角色名称" />
            </el-form-item>
            <el-form-item label="角色描述" prop="remark">
                <el-input
                    v-model="formData.remark"
                    :rows="2"
                    type="textarea"
                    maxlength="200"
                    placeholder="请输入角色描述"
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
