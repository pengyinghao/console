<script setup lang="ts">
import { FormInstance } from 'element-plus'
import { ruleHelper } from '@/utils/ruleHelper'
import { updatePassword } from '@/service/api/system/user'
import { encrypt } from '@/utils/crypto'
import { useUserStore } from '@/store'

const visible = ref(false)
const loading = ref(false)

const refForm = ref<FormInstance>()
const formData = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
    if (!value) {
        return callback(new Error('请输入确认密码'))
    }
    if (value !== formData.newPassword) {
        return callback(new Error('两次输入密码不一致!'))
    }
    callback()
}

const validateNewPassword = (rule: any, value: string, callback: any) => {
    if (!value) {
        return callback(new Error('请输入新密码'))
    }
    if (value === formData.oldPassword) {
        return callback(new Error('新密码不能与旧密码相同!'))
    }
    callback()
}

const { mul_special } = ruleHelper
const rules = reactive<any>({
    oldPassword: [
        { required: true, message: '请输入旧密码', trigger: 'blur' },
        {
            type: 'string',
            pattern: mul_special.reg,
            message: `旧密码${mul_special.message}`,
            trigger: 'blur'
        }
    ],
    newPassword: [
        { required: true, validator: validateNewPassword, trigger: 'blur' },
        {
            type: 'string',
            pattern: mul_special.reg,
            message: `新密码${mul_special.message}`,
            trigger: 'blur'
        }
    ],
    confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }]
})

const userStore = useUserStore()
const close = async (success = false) => {
    visible.value = false
    refForm.value?.resetFields()
    if (success) {
        try {
            await window.$messageBox.alert('密码修改成功，请重新登录！', '提示', {
                confirmButtonText: '确定',
                type: 'success'
            })
        } finally {
            userStore.loginOut(false)
        }
    }
}

const showModal = () => {
    visible.value = true
}

const handleConfirm = async () => {
    await refForm.value?.validate()
    try {
        loading.value = true
        await updatePassword(encrypt(formData.oldPassword), encrypt(formData.newPassword))
        close(true)
    } finally {
        loading.value = false
    }
}

defineExpose({ showModal })
</script>
<template>
    <Modal v-model="visible" title="修改密码" width="550" :before-close="() => close()">
        <el-alert title="注：密码修改成功后需要重新登录！" type="warning" />
        <el-form ref="refForm" :model="formData" :rules="rules" label-width="85px" class="mt-16px">
            <el-form-item label="账号密码" prop="oldPassword">
                <el-input
                    v-model="formData.oldPassword"
                    type="password"
                    show-password
                    maxlength="20"
                    placeholder="请输入账号密码"
                />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input
                    v-model="formData.newPassword"
                    maxlength="20"
                    type="password"
                    show-password
                    placeholder="请输入新密码"
                />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                    v-model="formData.confirmPassword"
                    maxlength="20"
                    type="password"
                    show-password
                    placeholder="请输入确认密码"
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
