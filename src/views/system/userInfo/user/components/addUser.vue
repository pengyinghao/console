<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import { createUser } from '@/service/api/system/user'
import { ruleHelper } from '@/utils/ruleHelper'
import { Role, fetchRoleInfos } from '@/service/api/system/role'
import { encrypt } from '@/utils/crypto'

const emits = defineEmits<{
    (e: 'close', refreshData: boolean): void
}>()

const refForm = ref<FormInstance>()
const formData = reactive({
    name: '',
    no: '',
    account: '',
    password: '',
    password2: '',
    phone: '',
    roleId: undefined,
    roleName: undefined,
    email: undefined,
    address: undefined
})

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
    if (!value) {
        return callback(new Error('请输入确认密码'))
    }
    if (value !== formData.password) {
        return callback(new Error('两次输入密码不一致!'))
    }
    callback()
}

const { unable_contain_special, only_alphanumeric_underline, phone, email, mul_special } = ruleHelper
const rules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        {
            type: 'string',
            pattern: unable_contain_special.reg,
            message: `姓名${unable_contain_special.message}`
        }
    ],
    no: [
        { required: true, message: '请输入编号', trigger: 'blur' },
        {
            type: 'string',
            pattern: only_alphanumeric_underline.reg,
            message: `编号${only_alphanumeric_underline.message}`
        }
    ],
    account: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        {
            type: 'string',
            pattern: only_alphanumeric_underline.reg,
            message: `账号${only_alphanumeric_underline.message}`
        }
    ],
    email: [{ type: 'string', pattern: email.reg, message: email.message }],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
            type: 'string',
            pattern: mul_special.reg,
            message: `密码${mul_special.message}`
        }
    ],
    roleId: [{ required: true, message: '请选择角色' }],
    password2: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
    phone: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        {
            type: 'string',
            pattern: phone.reg,
            message: phone.message
        }
    ]
})

const visible = ref(false)
const loading = ref(false)

const showModal = () => {
    visible.value = true
}

const close = (refreshData = false) => {
    refForm.value?.resetFields()
    visible.value = false
    emits('close', refreshData)
}

const saveUser = async () => {
    try {
        loading.value = true
        const newFormData = { ...formData }
        newFormData.password = encrypt(newFormData.password)
        await createUser(newFormData)
        close(true)
    } finally {
        loading.value = false
    }
}

const handleRoleChange = (val: number, row: Role) => {
    formData.roleName = row.name as any
}
const handleConfirm = async () => {
    await refForm.value?.validate()
    saveUser()
}

defineExpose({
    showModal
})
</script>

<template>
    <Modal v-model="visible" title="新增用户" width="500" :before-close="() => close()">
        <el-form ref="refForm" :model="formData" :rules="rules" label-width="85px">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="formData.name" maxlength="30" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="编号" prop="no">
                <el-input v-model="formData.no" maxlength="30" placeholder="请输入编号" />
            </el-form-item>
            <el-form-item label="账号" prop="account">
                <el-input v-model="formData.account" maxlength="20" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="formData.password" maxlength="20" type="password" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item label="确认密码" prop="password2">
                <el-input v-model="formData.password2" maxlength="20" type="password" placeholder="请输入确认密码" />
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="formData.phone" maxlength="11" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="formData.email" maxlength="50" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
                <Select
                    v-model="formData.roleId"
                    :request-api="fetchRoleInfos"
                    display-label="name"
                    display-value="id"
                    placeholder="请选择角色"
                    @change="handleRoleChange"
                ></Select>
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input v-model="formData.address" maxlength="100" placeholder="请输入地址" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="() => close()">取消</el-button>
                <el-button type="primary" @click="handleConfirm">确定</el-button>
            </div>
        </template>
    </Modal>
</template>

<style lang="scss" scoped></style>
