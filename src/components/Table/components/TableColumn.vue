<script setup lang="tsx">
import { defineProps } from 'vue'
import { TableColumn, TableColumnScope, TableHeaderScope } from '../type'
defineProps<{ column: TableColumn }>()

const renderColumn = (item: TableColumn) => {
    if (item.hide) return <></>

    return (
        <el-table-column {...item}>
            {{
                default: (scope: TableColumnScope<any>) => {
                    // 多级表头
                    if (item.children) return item.children.map((child) => renderColumn(child))
                    // 自定义渲染
                    if (item.render) return item.render(scope)
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    return (scope.row || {})[item.prop!]
                },
                header: (scope: TableHeaderScope<any>) => {
                    if (item.renderHeader) return item.renderHeader(scope)
                    return item.label
                }
            }}
        </el-table-column>
    )
}
</script>
<template>
    <render-Column v-bind="column"></render-Column>
</template>
