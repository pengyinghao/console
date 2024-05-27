import { FormProps } from 'element-plus'
import { SearchControlOption } from './searchControl'

export type SearchProps = {
    options: SearchControlOption[]
} & Partial<FormProps>
