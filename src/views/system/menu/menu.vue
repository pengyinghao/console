<script lang="tsx" setup>
import { SearchOption, StatusView, TableColumn } from '@/components'
import { Menu, deleteMenu, fetchMenuInfos } from '@/service/api/system/menu'
import MenuEdit from './components/menuEdit.vue'
import { useCompRef } from '@/composables/useCompRef'
import { copyText, setDefaultValue } from '@/utils'
import Icon from '@/components/Icon/Icon.vue'

// eslint-disable-next-line vue/no-reserved-component-names
defineOptions({ name: 'Menu' })
const reload = ref(false)

const handleSearch = () => {
    reload.value = true
}

const refMenuEdit = useCompRef(MenuEdit)
const handleMenuEdit = (id?: number) => {
    refMenuEdit.value?.showModal(id)
}

const handleDeleteSystemMenu = async ({ id, children, status }: Menu) => {
    if (status === 1) return window.$message.error('请先禁用菜单')
    if (children!.length > 0) return window.$message.error('请先删除子菜单')
    await window.$messageBox.confirm(`确定要删除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    await deleteMenu(id)
    handleSearch()
}

const handleClose = (refreshData: boolean) => {
    refreshData && handleSearch()
}

const columns: TableColumn<Menu>[] = [
    { label: '菜单名称', prop: 'name', width: 200 },
    {
        label: '状态',
        render: ({ row }) => <StatusView status={row.status}></StatusView>
    },
    {
        label: '图标',
        prop: 'icon',
        render: ({ row }) => {
            return row.icon ? <Icon name={row.icon}></Icon> : setDefaultValue()
        }
    },
    { label: '显示顺序', prop: 'sort' },
    {
        label: '文件路径',
        width: 300,
        render: ({ row }) => {
            if (row.component) {
                return (
                    <div class="flex-y-center">
                        <span>{row.component}</span>
                        <Icon
                            name="ep:copy-document"
                            class="ml-2px cursor-pointer hover:c-primary"
                            title="复制组件地址"
                            onClick={() => copyText(row.component!)}></Icon>
                    </div>
                )
            }
            return setDefaultValue()
        }
    },
    { label: '创建时间', prop: 'createTime', dateFormat: true, width: 160 },
    { label: '更新时间', prop: 'updateTime', dateFormat: true, width: 160 },
    {
        label: '操作',
        prop: 'operation',
        fixed: 'right',
        width: 100,
        render: ({ row }) => {
            return (
                <div class="flex-y-center">
                    <a onclick={() => handleMenuEdit(row.id)}>修改</a>
                    <el-divider direction="vertical" />
                    <a onclick={() => handleDeleteSystemMenu(row)}>删除</a>
                </div>
            )
        }
    }
]

const options = reactive<SearchOption[]>([{ mode: 'input', label: '菜单名称', field: 'name' }])
</script>
<template>
    <PageContainer>
        <Table
            v-model:reload="reload"
            :columns="columns"
            :request-api="fetchMenuInfos"
            :pagination="false"
            :search="{ options: options, labelWidth: 110 }"
        >
            <template #header-left>
                <el-button type="primary" @click="handleMenuEdit()"> 新增 </el-button>
            </template>
        </Table>
        <menu-edit ref="refMenuEdit" @close="handleClose"></menu-edit>
    </PageContainer>
</template>
