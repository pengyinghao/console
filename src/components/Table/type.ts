import { TableColumnCtx } from 'element-plus'
import { VNode } from 'vue'

export type TableColumnType = 'default' | 'selection' | 'index' | 'expand'

export type TableHeaderScope<T> = {
    $index: number
    column: TableColumnCtx<T>
}

export type TableColumnScope<T> = {
    row: T
    /** 列 */
    column: TableColumnCtx<T>
    /** 是否展开 */
    expanded: boolean
    /** 行索引 */
    $index: number
    /** 列索引 */
    cellIndex: number
}

type FixedOption = 'left' | 'right' | boolean

export interface TableColumn<T = any>
    extends Partial<Omit<TableColumnCtx<T>, 'type' | 'children' | 'renderCell' | 'renderHeader'>> {
    /** 列类型 */
    type?: TableColumnType
    /** 列是否固定在左侧或者右侧。 */
    fixed?: FixedOption
    /** 隐藏列 */
    hide?: boolean
    /** 日期格式化 */
    dateFormat?: boolean
    /** 日期格式化格式 */
    format?: string
    /** 自定义header */
    renderHeader?: (scope: TableHeaderScope<T>) => VNode | string
    /** 自定义内容 */
    render?: (scope: TableColumnScope<T>) => VNode | string | number | boolean
    /** 多级表头 */
    children?: TableColumn<T>[]
}

export interface TableProps {
    columns: TableColumn[]
    /** 数据源 */
    data?: any[]
    /** 请求方法,如果data存在数据，则不会执行此方法 */
    requestApi?: (args: any) => Promise<any>
    /** 请求参数 */
    requestParams?: Record<string, any>
    /** 是否立即加载数据,默认为true */
    load?: boolean
    /** 数据加载完成回调 */
    callBack?: (data) => void
    /** 是否显示刷新按钮 */
    showRefreshBtn?: boolean
    /** 是否分页,默认为true */
    pagination?: boolean

    /** 行数据的 Key，（默认为 id） */
    rowKey?: string
}

export interface TableReactive {
    /** 数据是否加载中 */
    loading: boolean
    /** 数据源  */
    dataSource: any[]
    /** 排序字段 */
    sortDataField?: string
    /** 是否正序 */
    asc?: boolean
}

export interface PaginationReactive {
    /** 当前页数 */
    currentPage: number
    /** 每页条数 */
    pageSize: number
    /**  总条数 */
    total: number
}
