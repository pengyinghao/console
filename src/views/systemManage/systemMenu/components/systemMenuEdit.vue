<script setup lang="ts">
import { reactive, ref } from 'vue'
import { FormInstance } from 'element-plus'
import { Modal, Icon } from '@/components'
import {
    UpdateSystemMenuOption,
    createMenu,
    fetchMenuDetail,
    updateMenu,
    Menu,
    fetchTreeMenu
} from '@/service/api/system/menu'
import { ruleHelper } from '@/utils/ruleHelper'

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
    componentLink: '',
    hidden: false,
    state: 1,
    openType: 0
})

const openTypeList = [
    { value: 0, label: '路由' },
    { value: 1, label: '内嵌' },
    { value: 2, label: '链接' }
]

const { unable_contain_special } = ruleHelper
const rules = reactive({
    name: [
        { required: true, message: '请输入菜单名称', trigger: 'blur' },
        {
            type: 'string',
            pattern: unable_contain_special.reg,
            message: `菜单名称${unable_contain_special.message}`
        }
    ],
    sort: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }]
})

const close = (refreshData = false) => {
    formData.parentId = undefined
    formData.openType = 0
    formData.state = 1
    formData.hidden = false

    refForm.value?.resetFields()
    visible.value = false
    emit('close', refreshData)
}

const handleConfirm = async () => {
    await refForm.value?.validate()
    formData.id ? await updateMenu(formData) : await createMenu(formData)
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

defineExpose({
    showModal
})
</script>
<template>
    <Modal
        v-model="visible"
        :title="formData.id ? '修改菜单' : '新增菜单'"
        width="700"
        :before-close="() => close()"
    >
        <el-form
            ref="refForm"
            label-suffix="："
            :model="formData"
            :rules="rules"
            label-width="85px"
        >
            <el-form-item label="上级菜单" prop="parentId">
                <el-tree-select
                    v-model="formData.parentId"
                    :data="menus"
                    :check-strictly="true"
                    node-key="id"
                    :props="{ label: 'name' }"
                >
                </el-tree-select>
            </el-form-item>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="菜单名称" prop="name">
                        <el-input v-model="formData.name" maxlength="20"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="图标" prop="icon">
                        <el-input v-model="formData.icon"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="组件地址" prop="componentLink">
                        <el-input v-model="formData.componentLink"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="页面地址" prop="url">
                        <el-input v-model="formData.url"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="打开方式" prop="openType">
                        <el-select v-model="formData.openType">
                            <el-option
                                v-for="item in openTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="显示顺序" prop="sort">
                        <el-input-number
                            v-model="formData.sort"
                            controls-position="right"
                            :precision="0"
                            :min="1"
                            :max="999"
                            class="w-100%"
                        ></el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="状态" name="state">
                        <template #label>
                            <div class="form-item-slot">
                                <el-tooltip
                                    class="box-item"
                                    effect="dark"
                                    content="选择禁用路由将不会出现在侧边栏，也不能被访问"
                                    placement="bottom"
                                >
                                    <Icon name="ph:question"></Icon>
                                </el-tooltip>
                                <span>显示状态</span>
                            </div>
                        </template>
                        <el-radio-group v-model="formData.state">
                            <el-radio :value="1">启用</el-radio>
                            <el-radio :value="0">禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="显示状态" name="hidden">
                        <template #label>
                            <div class="form-item-slot">
                                <el-tooltip
                                    class="box-item"
                                    effect="dark"
                                    content="选择隐藏路由将不会出现在侧边栏，但仍然可以访问"
                                    placement="bottom"
                                >
                                    <Icon name="ph:question"></Icon>
                                </el-tooltip>
                                <span>显示状态</span>
                            </div>
                        </template>
                        <el-radio-group v-model="formData.hidden">
                            <el-radio :value="false">显示</el-radio>
                            <el-radio :value="true">隐藏</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
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
