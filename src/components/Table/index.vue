<script setup lang="ts">
import {
    withDefaults,
    defineProps,
    ref,
    reactive,
    computed,
    watch,
    watchEffect,
    toRefs,
    onBeforeMount
} from 'vue'
import { TableProps, TableColumnType, TableReactive, PaginationReactive } from './type'
import { Icon } from '@/components'
import TableColumn from './components/TableColumn.vue'
import initMethods from './methods'

// column 列类型
const columnTypes: TableColumnType[] = ['selection', 'index', 'expand']

const props = withDefaults(defineProps<TableProps>(), {
    rowKey: 'id',
    load: true,
    resetPage: false,
    showRefreshBtn: true,
    pagination: true
})

const table = reactive<TableReactive>({
    loading: false,
    dataSource: [],
    sortDataField: undefined,
    asc: undefined
})

const paginationState = reactive<PaginationReactive>({
    currentPage: 1,
    pageSize: 10,
    total: 0
})

const dataSource = computed(() => {
    return props.data || table.dataSource
})

const getTableData = async () => {
    try {
        // eslint-disable-next-line no-console
        if (!props.requestApi) return console.error('请传入请求方法')
        table.loading = true
        const result = await props.requestApi({
            pageNo: paginationState.currentPage,
            pageSize: paginationState.pageSize,
            asc: table.asc,
            sortDataField: table.sortDataField,
            ...props.requestParams
        })

        // 判断不是第一页 没数据情况
        if (result.total === 0 && paginationState.currentPage > 1) {
            paginationState.currentPage--
            return getTableData()
        }

        paginationState.total = result.total
        table.dataSource = result.data
        props.callBack && props.callBack(result.data)
    } finally {
        // eslint-disable-next-line no-use-before-define
        reload.value = false
        // eslint-disable-next-line no-use-before-define
        resetPage.value = false
        table.loading = false
    }
}

/** 重置分页 */
const resetPage = defineModel('resetPage', { type: Boolean, default: false })
/** 是否重新加载数据 */
const reload = defineModel('reload', { type: Boolean, default: false })

// 传递参数变化，重新查询
watch(
    () => props.requestParams,
    () => {
        paginationState.currentPage = 1
        getTableData()
    }
)

watchEffect(() => {
    if (resetPage.value) {
        paginationState.currentPage = 1
        getTableData()
    }
    if (reload.value) {
        getTableData()
    }
})

const init = () => {
    if (props.data) {
        table.dataSource = toRefs(props.data)
    } else if (props.load) {
        getTableData()
    }
}

onBeforeMount(() => {
    init()
})

// 初始化table方法
const tableRef = ref()
const methods = initMethods(tableRef)

defineExpose({
    ...methods
})
</script>
<template>
    <div class="c-table">
        <div class="c-table-header">
            <el-button @click="getTableData">
                <Icon name="ep:refresh" />
            </el-button>
            <slot name="header"></slot>
        </div>
        <el-table
            v-bind="$attrs"
            ref="tableRef"
            v-loading="table.loading"
            :data="dataSource"
            :row-key="rowKey"
        >
            <template v-for="column in columns" :key="column[rowKey]">
                <el-table-column
                    v-if="column.type && columnTypes.includes(column.type)"
                    v-bind="column"
                    :align="column.align ?? 'center'"
                    :reserve-selection="column.type == 'selection'"
                >
                    <template #default="scope">
                        <template v-if="column.type == 'expand'">
                            <component :is="column.render" v-bind="scope" v-if="column.render" />
                            <slot v-else :name="column.type" v-bind="scope" />
                        </template>
                    </template>
                </el-table-column>
                <TableColumn v-else :column="column"> </TableColumn>
            </template>
        </el-table>
        <!-- 表格尾区域 -->
        <div class="c-table-footer">
            <slot name="footer"></slot>
            <el-pagination
                v-if="pagination"
                v-model:current-page="paginationState.currentPage"
                v-model:page-size="paginationState.pageSize"
                :page-sizes="[10, 20, 30, 50]"
                :total="paginationState.total"
                layout="total, sizes, prev, pager, next, jumper"
                class="mt-10px justify-end"
                @change="getTableData"
            />
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import './table.scss';
</style>