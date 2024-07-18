<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import {
    createDict,
    UpdateDictOption,
    updateDict,
    fetchDictDetail,
    DictType,
    fetchDictTypeAllInfos
} from '@/service/api/system/dictionary'
import { ruleHelper } from '@/utils/ruleHelper'
import { Status } from '@/core/enums/status'
import { STATUS_FORM_ITEM } from '@/core/constant'

const emits = defineEmits<{
    (e: 'close', refreshData: boolean): void
}>()

const refForm = ref<FormInstance>()

const formData = reactive<UpdateDictOption>({
    id: undefined,
    name: '',
    value: '',
    status: Status.ENABLE,
    sort: 1,
    typeId: undefined,
    remark: undefined
})

const { unable_contain_special, only_alphanumeric_underline } = ruleHelper
const rules = reactive<FormRules>({
    no: [
        { required: true, message: '请输入编号', trigger: 'blur' },
        {
            pattern: only_alphanumeric_underline.reg,
            message: `编号${only_alphanumeric_underline.message}`
        }
    ],
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        {
            type: 'string',
            pattern: unable_contain_special.reg,
            message: `名称${unable_contain_special.message}`
        }
    ]
})

const visible = ref(false)
const loading = ref(false)

/** 获取字典类型详情 */
const getDictDetail = async () => {
    if (!formData.id) return
    try {
        loading.value = true
        const result = await fetchDictDetail(formData.id)
        Object.assign(formData, result)
    } finally {
        loading.value = false
    }
}

const dictTypeInfos = ref<DictType[]>([])
/** 获取所有字典类型 */
const getDictTypeInfos = async () => {
    const res = await fetchDictTypeAllInfos()
    dictTypeInfos.value = res
}

const showModal = (id?: number) => {
    getDictTypeInfos()
    formData.id = id
    id && getDictDetail()
    visible.value = true
}

const close = (refreshData = false) => {
    formData.typeId = undefined
    refForm.value?.resetFields()
    visible.value = false
    emits('close', refreshData)
}

const saveData = async () => {
    try {
        loading.value = true
        formData.id ? await updateDict(formData) : await createDict(formData)
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
        :title="formData.id ? '修改字典信息' : '新增字典信息'"
        width="500"
        :before-close="() => close()"
    >
        <el-form ref="refForm" :model="formData" :rules="rules" label-width="85px">
            <el-form-item label="字典类型" name="typeId">
                <el-select v-model="formData.typeId">
                    <el-option v-for="item in dictTypeInfos" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="formData.name" maxlength="20" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="字典值" prop="value">
                <el-input v-model="formData.value" maxlength="20" placeholder="请输入字典值" />
            </el-form-item>
            <el-form-item label="显示顺序" prop="sort">
                <el-input-number v-model="formData.sort" :min="1" :max="99" :precision="0" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-radio-group v-model="formData.status">
                    <el-radio v-for="item in STATUS_FORM_ITEM" :key="item.value" :value="item.value">
                        {{ item.label }}
                    </el-radio>
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
