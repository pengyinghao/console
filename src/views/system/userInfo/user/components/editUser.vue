<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { fetchUserDetail, updateUser, UpdateUserOption } from '@/service/api/system/user'
import { ruleHelper } from '@/utils/ruleHelper'
import { Role, fetchRoleInfos } from '@/service/api/system/role'
import { Select } from '@/components'

const emits = defineEmits<{
    (e: 'close', refreshData: boolean): void
}>()

const refForm = ref<FormInstance>()
const formData = reactive<UpdateUserOption>({
    name: '',
    phone: '',
    email: undefined,
    roleId: undefined,
    roleName: undefined,
    address: undefined
})

const { unable_contain_special, phone, email } = ruleHelper
const rules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        {
            type: 'string',
            pattern: unable_contain_special.reg,
            message: `姓名${unable_contain_special.message}`
        }
    ],
    phone: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        {
            type: 'string',
            pattern: phone.reg,
            message: phone.message
        }
    ],
    roleId: [{ required: true, message: '请选择角色' }],
    email: [{ type: 'string', pattern: email.reg, message: email.message }]
})

const visible = ref(false)
const loading = ref(false)

const getUserDetail = async (id: number) => {
    try {
        loading.value = true
        const result = await fetchUserDetail(id)
        Object.assign(formData, result)
    } finally {
        loading.value = false
    }
}

const showModal = (id: number) => {
    getUserDetail(id)
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
        await updateUser(formData)
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
    <el-dialog v-model="visible" title="修改用户" width="500" :before-close="() => close()">
        <el-form ref="refForm" :model="formData" :rules="rules" label-width="85px">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="formData.name" maxlength="30" placeholder="请输入姓名" />
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
                <el-button type="primary" :loading="loading" @click="handleConfirm">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped></style>
