import { VNode } from 'vue'
import { InputProps, DatePickerProps } from 'element-plus'
import { SelectProps } from '../Select/selectType'

/** 文本 */
export type InputOption = { mode: 'input' } & Optional<Pick<InputProps, 'clearable'>, 'clearable'>

/** 单选 */
export type RadioOption = { mode: 'radio' }

/** 下拉 */
export type SelectOption = {
    mode: 'select'
} & Pick<
    SelectProps,
    | 'typeNo'
    | 'requestApi'
    | 'requestParams'
    | 'displayLabel'
    | 'displayValue'
    | 'data'
    | 'multiple'
    | 'multipleLimit'
>

/** 日期 */
export type DateOption = {
    mode: 'date'
} & Optional<
    Pick<DatePickerProps, 'type' | 'valueFormat' | 'clearable' | 'format'>,
    'clearable' | 'format' | 'valueFormat'
>

export type ControlOption = {
    /** 绑定值 */
    value?: any
    /** 传递给后端的字段 */
    field: string
    /** 默认查询值 */
    defaultValue?: any
    /** 标题 */
    label: string
    width?: string | number
    // eslint-disable-next-line no-use-before-define
    render?: (item: SearchControlOption, handleQuery: () => void) => VNode
}

export type SearchControlOption = (InputOption | RadioOption | SelectOption | DateOption) &
    ControlOption
