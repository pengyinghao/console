import { ISelectProps } from 'element-plus'
export interface SelectProps extends Partial<ISelectProps> {
    /** 字典编号,通过字典编号查询 字典信息 */
    typeNo?: string
    /** 请求方法,如果data存在数据，则不会执行此方法 */
    requestApi?: (args: any) => Promise<any>
    /** 请求参数 */
    requestParams?: Record<string, any>
    /** 隐藏值 */
    displayValue?: string
    /** 显示值 */
    displayLabel?: string
    /** 静态数据源 */
    data?: Array<any>
}
