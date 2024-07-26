<script setup lang="ts">
import { TreeInstance } from 'element-plus'
import { Role, authorize, fetchAuthorizeMenuIds } from '@/service/api/system/role'
import { DefaultNavigate, Menu, fetchMenuInfos } from '@/service/api/system/menu'

const visible = ref(false)
const roleInfo = ref<Role>()

const refTree = ref<TreeInstance>()
const loading = ref(false)

/** 菜单信息 */
const menuInfos = ref<Menu[]>([])
const defaultNavigate = ref('')

/** 树形所有节点 */
const treeNodes = computed<any>(() => {
    if (refTree.value) {
        const nodes = refTree.value.store.nodesMap
        return nodes
    }
    return {}
})

// 默认导航
const defaultNavigateInfos = computed(() => {
    return Object.entries(treeNodes.value)
        .filter((item: any) => item[1].checked && item[1].data.url)
        .map((item: any) => {
            return {
                url: item[1].data.url,
                name: item[1].data.name
            } as DefaultNavigate
        })
})

/** 菜单勾选值改变事件 */
const handleCheckChange = (node: Menu, nodeCheck: boolean) => {
    node.children!.forEach((item) => {
        refTree.value?.setChecked(item.id, nodeCheck, true)
    })
}

const expand = ref(false)
/** 展开、收缩 */
const handleExpand = () => {
    expand.value = !expand.value
    for (const node in treeNodes.value) {
        treeNodes.value[node].expanded = expand
    }
}

const checkAll = ref(false)
/** 全选/反选 */
const handleCheckAll = () => {
    checkAll.value = !checkAll.value
    for (const node in treeNodes.value) {
        refTree.value?.setChecked(treeNodes.value[node].data.id, checkAll.value, true)
    }
}

const show = async (row: Role) => {
    loading.value = true
    visible.value = true
    roleInfo.value = row

    try {
        loading.value = true
        // 获取菜单、 勾选的菜单id集合
        const [menu, menuIds] = await Promise.all([fetchMenuInfos(), fetchAuthorizeMenuIds(row.id)])
        menuInfos.value = menu

        // 设置勾选的菜单
        refTree.value?.setCheckedKeys(menuIds, true)

        // 设置默认导航
        defaultNavigate.value = row.defaultNavigate!
    } finally {
        loading.value = false
    }
}

const handleClose = () => {
    menuInfos.value = []
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
    <el-drawer v-model="visible" title="角色授权" :size="350" :close-on-click-modal="false" :before-close="handleClose">
        <div v-loading="loading" class="h-full flex flex-col">
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
                            :value="item.url as string"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="mb-10px">
                <el-button-group size="small">
                    <el-button type="primary" @click="handleExpand()">展开/折叠</el-button>
                    <el-button type="primary" @click="handleCheckAll()">全选/反选</el-button>
                </el-button-group>
            </div>
            <el-tree
                ref="refTree"
                :data="menuInfos"
                show-checkbox
                node-key="id"
                class="flex-1"
                :props="{ label: 'name' }"
                :check-strictly="true"
                @check-change="handleCheckChange"
            />
        </div>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleConfirm">确定</el-button>
        </template>
    </el-drawer>
</template>

<style scoped></style>
