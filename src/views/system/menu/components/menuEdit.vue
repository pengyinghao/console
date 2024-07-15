<script setup lang="ts">
import { reactive, ref } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { Modal, Icon } from '@/components'
import {
    UpdateSystemMenuOption,
    createMenu,
    fetchMenuDetail,
    updateMenu,
    Menu,
    fetchTreeMenu,
    MenuType,
    MenuDisplay,
    MenuOpenType,
    MenuFixed
} from '@/service/api/system/menu'
import { ruleHelper } from '@/utils/ruleHelper'
import { isJSON } from '@/utils'
import { Status } from '@/core/enums/status'
import { STATUS_FORM_ITEM } from '@/core/constant'

const emit = defineEmits<{
    close: [refreshData: boolean]
}>()

const visible = ref(false)
const loading = ref(false)

const refForm = ref<FormInstance>()
const formData = reactive<UpdateSystemMenuOption>({
    name: '',
    sort: 1,
    icon: '',
    component: '',
    display: MenuDisplay.SHOW,
    type: MenuType.DIRECTORY,
    status: Status.ENABLE,
    openType: MenuOpenType.ROUTE,
    fixed: MenuFixed.NOT_FIXED
})

const { unable_contain_special } = ruleHelper
const paramsValidation = (rule: any, value: string, callback: any) => {
    if (!value) return callback()
    if (!isJSON(value)) return callback(new Error('路由参数必须是json格式'))
    callback()
}
const rules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入菜单名称', trigger: 'blur' },
        {
            type: 'string',
            pattern: unable_contain_special.reg,
            message: `菜单名称${unable_contain_special.message}`
        }
    ],
    code: [{ required: true, message: '请输入功能代码', trigger: 'blur' }],
    component: [{ required: true, message: '请输入组件地址', trigger: 'blur' }],
    url: [{ required: true, message: '请输入页面地址', trigger: 'blur' }],
    sort: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }],
    params: [{ validator: paramsValidation, trigger: 'blur' }]
})

const close = (refreshData = false) => {
    formData.parentId = undefined
    formData.openType = 0
    formData.status = 1
    formData.display = 0
    formData.fixed = 1

    refForm.value?.resetFields()
    visible.value = false
    emit('close', refreshData)
}

const handleConfirm = async () => {
    await refForm.value?.validate()
    if (formData.id && formData.parentId && formData.id === formData.parentId) {
        return window.$message.error('上级菜单不能为当前菜单')
    }
    const newFormData = { ...formData }
    if (newFormData.type !== MenuType.MENU) {
        newFormData.fixed = MenuFixed.NOT_FIXED
    }
    newFormData.parentId = newFormData.parentId === undefined ? null : newFormData.parentId
    newFormData.id ? await updateMenu(newFormData) : await createMenu(newFormData)
    close(true)
}

/** 获取菜单详情 */
const getMenuDetail = async (id: number) => {
    try {
        loading.value = true
        const res = await fetchMenuDetail(id)
        delete res.createTime
        delete res.updateTime
        Object.assign(formData, { ...res })
    } finally {
        loading.value = false
    }
}

const menus = ref<Menu[]>([])
const getMenuInfos = async () => {
    const res = await fetchTreeMenu()
    menus.value = res
}

const showModal = (id?: number) => {
    formData.id = id
    getMenuInfos()
    id && getMenuDetail(id)
    visible.value = true
}

/** 菜单打开方式 */
const openTypeList = [
    { value: MenuOpenType.ROUTE, label: '路由' },
    { value: MenuOpenType.IFRAME, label: '内嵌' },
    { value: MenuOpenType.LINK, label: '链接' }
]

/** 菜单类型 */
const type = [
    { value: MenuType.DIRECTORY, label: '目录' },
    { value: MenuType.MENU, label: '菜单' },
    { value: MenuType.BUTTON, label: '按钮' }
]

/** 菜单显示状态 */
const display = [
    { value: MenuDisplay.SHOW, label: '显示' },
    { value: MenuDisplay.HIDE, label: '隐藏' }
]

/** 菜单是否固定 */
const fixed = [
    { value: MenuFixed.FIXED, label: '固定' },
    { value: MenuFixed.NOT_FIXED, label: '不固定' }
]

defineExpose({
    showModal
})
</script>
<template>
    <Modal v-model="visible" :title="formData.id ? '修改菜单' : '新增菜单'" width="600" :before-close="() => close()">
        <el-form ref="refForm" :model="formData" :rules="rules" label-width="100px">
            <el-form-item label="上级菜单" prop="parentId">
                <el-tree-select
                    v-model="formData.parentId"
                    :data="menus"
                    :check-strictly="true"
                    node-key="id"
                    clearable
                    :props="{ label: 'name' }"
                >
                </el-tree-select>
            </el-form-item>
            <el-form-item label="菜单类型" prop="type">
                <el-radio-group v-model="formData.type">
                    <el-radio v-for="item in type" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="formData.type === MenuType.BUTTON" label="功能代码" prop="code">
                <el-input v-model="formData.code" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="菜单名称" prop="name">
                <el-input v-model="formData.name" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
                <el-input v-model="formData.icon" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item v-if="formData.type === MenuType.MENU" label="打开方式" prop="openType">
                <el-select v-model="formData.openType" class="w-250px">
                    <el-option v-for="item in openTypeList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item
                v-if="formData.type === MenuType.MENU && formData.openType === MenuOpenType.ROUTE"
                label="组件地址"
                prop="component"
            >
                <el-input v-model="formData.component"></el-input>
            </el-form-item>
            <el-form-item v-if="formData.type === MenuType.MENU" label="页面地址" prop="url">
                <el-input v-model="formData.url"></el-input>
            </el-form-item>
            <el-form-item label="显示顺序" prop="sort">
                <el-input-number
                    v-model="formData.sort"
                    controls-position="right"
                    :precision="0"
                    :min="1"
                    :max="999"
                    class="w-250px"
                />
            </el-form-item>
            <div class="flex-y-center mb-8px">
                <el-form-item label="状态" name="status" class="!mb-0 w-50%">
                    <template #label>
                        <div class="form-item-slot">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                content="选择禁用路由将不会出现在侧边栏，也不能被访问"
                                placement="bottom"
                            >
                                <Icon name="ep:question-filled"></Icon>
                            </el-tooltip>
                            <span class="ml-4px">菜单状态</span>
                        </div>
                    </template>
                    <el-radio-group v-model="formData.status">
                        <el-radio v-for="item in STATUS_FORM_ITEM" :key="item.value" :value="item.value">
                            {{ item.label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="formData.type !== MenuType.BUTTON" label="显示状态" name="hidden" class="!mb-0">
                    <template #label>
                        <div class="form-item-slot">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                content="选择隐藏路由将不会出现在侧边栏，但仍然可以访问"
                                placement="bottom"
                            >
                                <Icon name="ep:question-filled"></Icon>
                            </el-tooltip>
                            <span class="ml-4px">显示状态</span>
                        </div>
                    </template>
                    <el-radio-group v-model="formData.display">
                        <el-radio v-for="item in display" :key="item.value" :value="item.value">
                            {{ item.label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>
            <template v-if="formData.type === MenuType.MENU">
                <div class="flex-y-center mb-8px">
                    <el-form-item label="固定页签" name="fixed" class="!mb-0 w-50%">
                        <el-radio-group v-model="formData.fixed">
                            <el-radio v-for="item in fixed" :key="item.value" :value="item.value">
                                {{ item.label }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <el-form-item label="路由参数" prop="params">
                    <template #label>
                        <div class="form-item-slot">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                content='路由参数必须是json格式，例如：{"id":1,"name":"test"}'
                                placement="bottom"
                            >
                                <Icon name="ep:question-filled"></Icon>
                            </el-tooltip>
                            <span class="ml-4px">路由参数</span>
                        </div>
                    </template>
                    <el-input v-model="formData.params" :rows="2" type="textarea" />
                </el-form-item>
            </template>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="() => close()">取消</el-button>
                <el-button type="primary" :loading="loading" @click="handleConfirm">确定</el-button>
            </div>
        </template>
    </Modal>
</template>
<style scoped></style>

<style lang="scss" scoped>
.form-item-slot {
    @apply flex-y-center mr-4px;
}
</style>
