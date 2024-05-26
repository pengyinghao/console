<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { TreeInstance } from 'element-plus'
import { Role, authorize, fetchAuthorizeMenuIds } from '@/service/api/system/role'
import { DefaultNavigate, Menu, fetchMenuInfos } from '@/service/api/system/menu'

const visible = ref(false)
const roleInfo = ref<Role>()

const refTree = ref<TreeInstance>()
const loading = ref(true)

/** 菜单信息 */
const menuInfos = ref<Menu[]>([])
/** 勾选的菜单id集合 */
const checkMenuIds = ref<number[]>([])

const defaultNavigate = ref('')
const defaultNavigateInfos = ref<DefaultNavigate[]>([])
const handleCheckChange = () => {
    const nodes = refTree.value?.getCheckedNodes() as Menu[]
    const result = nodes
        .filter((item) => item.type === 1)
        .map((item) => {
            return {
                url: item.url,
                name: item.name
            } as DefaultNavigate
        })
    defaultNavigateInfos.value = result
}

const show = async (row: Role) => {
    visible.value = true
    roleInfo.value = row
    try {
        loading.value = true
        const [menu, menuIds] = await Promise.all([fetchMenuInfos(), fetchAuthorizeMenuIds(row.id)])
        menuInfos.value = menu
        checkMenuIds.value = menuIds
        defaultNavigate.value = row.defaultNavigate!
        nextTick(() => {
            handleCheckChange()
        })
    } finally {
        loading.value = false
    }
}

const handleClose = () => {
    menuInfos.value = []
    checkMenuIds.value = []
    visible.value = false
}

const handleConfirm = async () => {
    if (!defaultNavigate.value) return window.$message.warning('请选择默认导航')
    const checkMenuIds = refTree.value?.getCheckedKeys() as number[]
    await authorize({
        roleId: roleInfo.value!.id,
        menuIds: checkMenuIds,
        defaultNavigate: defaultNavigate.value
    })
    handleClose()
}
defineExpose({
    show
})
</script>

<template>
    <el-drawer
        v-model="visible"
        title="角色授权"
        :size="350"
        :close-on-click-modal="false"
        :before-close="handleClose"
    >
        <div v-loading="loading">
            <el-form label-width="85px">
                <el-form-item label="角色名称" class="!mb-4px">
                    {{ roleInfo?.name }}
                </el-form-item>
                <el-form-item label="默认导航" class="is-required">
                    <el-select v-model="defaultNavigate" filterable placeholder="请选择默认导航">
                        <el-option
                            v-for="item in defaultNavigateInfos"
                            :key="item.name"
                            :label="item.name"
                            :value="item.url"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <el-tree
                ref="refTree"
                :data="menuInfos"
                show-checkbox
                node-key="id"
                :default-checked-keys="checkMenuIds"
                :props="{ label: 'name' }"
                @check="handleCheckChange"
            />
        </div>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleConfirm">确定</el-button>
        </template>
    </el-drawer>
</template>

<style scoped></style>
