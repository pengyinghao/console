import { InputProps, DatePickerProps } from 'element-plus'
import { SelectProps } from '../Select/selectType'

/** 文本 */
type InputOption = { mode: 'input' } & Optional<Pick<InputProps, 'placeholder'>, 'placeholder'>

/** 单选 */
type RadioOption = { mode: 'radio' }

/** 下拉 */
type SelectOption = {
    mode: 'select'
} & Pick<
    SelectProps,
    | 'placeholder'
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
type DateOption = {
    mode: 'date'
} & Optional<
    Pick<
        DatePickerProps,
        | 'type'
        | 'valueFormat'
        | 'clearable'
        | 'format'
        | 'placeholder'
        | 'startPlaceholder'
        | 'endPlaceholder'
    >,
    'clearable' | 'format' | 'valueFormat' | 'startPlaceholder' | 'endPlaceholder' | 'placeholder'
>

type ControlOption = {
    /** 绑定值 */
    value?: any
    valueLabel?: any
    /** 传递给后端的字段 */
    field?: string
    /** 标题 */
    label: string
    width?: string | number
    startField?: string
    endField?: string
}

export type SearchOption = (InputOption | RadioOption | SelectOption | DateOption) & ControlOption
