<script setup lang="tsx">
import { TableColumn, TableColumnScope, TableHeaderScope } from '../type'
import { dateFormat, setDefaultValue } from '@/utils'
defineProps<{ column: TableColumn }>()

const renderColumn = (item: TableColumn) => {
    if (item.hide) return <></>
    return (
        <el-table-column {...item}>
            {{
                default: (scope: TableColumnScope<any>) => {
                    if (Object.keys(scope.row).length === 0) return
                    // 多级表头
                    if (item.children) return item.children.map((child) => renderColumn(child))
                    // 自定义渲染
                    if (item.render) return item.render(scope)

                    // 格式化日期
                    if (item.dateFormat) return dateFormat((scope.row || {})[item.prop!], item.format)

                    return setDefaultValue((scope.row || {})[item.prop!])
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
