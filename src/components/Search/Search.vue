<script lang="tsx" setup>
import { onMounted, ref } from 'vue'
import { Select } from '../Select'
import { SearchProps } from './searchType'
import { SearchOption } from './searchControl'
import { Icon } from '../Icon'

const props = withDefaults(defineProps<SearchProps>(), {
    labelWidth: 90
})
const emit = defineEmits<{ search: [value: Record<string, any>] }>()

const queryConditions = ref<SearchOption[]>([])
const handleQuery = () => {
    const formData: Record<string, any> = {}
    queryConditions.value.forEach((item) => {
        if (!item.value) {
            delete formData[item.field]
        } else {
            formData[item.field] = item.value
        }
    })
    emit('search', formData)
}

/**  添加查询条件 */
const addQueryCondition = (item: SearchOption, displayLabel = '', execute = true) => {
    // 判断是否已经添加过,如果添加过 直接移出，并添加新条件
    const index = queryConditions.value.findIndex((condition) => condition.field === item.field)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const value = { ...item, displayLabel }

    if (index !== -1) queryConditions.value[index] = value
    else queryConditions.value.push(value)

    if (item.mode === 'input') {
        item.value = undefined
    }
    execute && handleQuery()
}

/** 查询条件关闭按钮单击事件 */
const handleConditionClose = (item: SearchOption) => {
    queryConditions.value = queryConditions.value.filter(
        (condition) => condition.field !== item.field
    )
    for (let i = 0; i < props.options.length; i++) {
        if (props.options[i].field === item.field) {
            // eslint-disable-next-line vue/no-mutating-props
            props.options[i].value = undefined
        }
    }
    handleQuery()
}

/** input 回车事件 */
const handleInputEnter = (e: KeyboardEvent, item: SearchOption) => {
    if (e.code !== 'Enter') return
    addQueryCondition(item)
}

/** 下拉值改变事件 */
const handleSelectChange = (row: any, item: SearchOption) => {
    let label = row.label
    if (item.mode === 'select') {
        if (item.displayLabel) {
            label = row[item.displayLabel]
        }
        addQueryCondition(item, label)
    }
}

const FormItem = (item: SearchOption) => {
    if (item.mode === 'input') {
        return (
            <el-input
                v-model={item.value}
                {...item}
                placeholder={item.placeholder || '请输入'}
                onkeydown={(e: KeyboardEvent) => handleInputEnter(e, item)}></el-input>
        )
    }
    if (item.mode === 'select') {
        return (
            <Select
                v-model={item.value}
                {...item}
                placeholder={item.placeholder || '请选择'}
                class="w-100%"
                onChange={(value: any, row: any) => handleSelectChange(row, item)}></Select>
        )
    }
    if (item.mode === 'date') {
        return (
            <el-date-picker
                v-model={item.value}
                {...item}
                clearable={false}
                placeholder={item.placeholder || '请选择'}
                format={item.format || 'YYYY-MM-DD'}
                value-format={item.valueFormat || 'YYYY-MM-DD'}
                onChange={() => addQueryCondition(item)}></el-date-picker>
        )
    }
}

const renderControlValue = ref(props.options.length > 0 ? props.options[0].field : '')
/** 查询按钮点击事件 */
const handleQueryBtnClick = () => {
    const item = props.options.find((item) => item.field === renderControlValue.value)
    // 如果是文本框，没回车不会赋值
    if (item?.mode === 'input') return handleInputEnter({ code: 'Enter' } as any, item)

    handleQuery()
}

const SearchForm = () => {
    return (
        <div class="search-container">
            <div class="search">
                <el-select
                    v-model={renderControlValue.value}
                    class="search-condition"
                    style={{ width: `${props.labelWidth}px` }}>
                    {props.options.map((item) => {
                        return <el-option value={item.field} label={item.label}></el-option>
                    })}
                </el-select>
                <div class="search-body">
                    {props.options
                        .filter((item) => item.field === renderControlValue.value)
                        .map((item) => {
                            return FormItem(item)
                        })}
                </div>
                <div class="search-btn" onclick={handleQueryBtnClick}>
                    <Icon name="ep:search" />
                </div>
            </div>
            <div class="condition">
                {queryConditions.value.map((item) => {
                    let value = item.value
                    if (item.mode === 'select') {
                        value = item.displayLabel
                    } else if (item.mode === 'date' && Array.isArray(item.value)) {
                        value = item.value.join('~')
                    }
                    return (
                        <el-tag type="info" closable onClose={() => handleConditionClose(item)}>
                            {`${item.label} : ${value} `}
                        </el-tag>
                    )
                })}
            </div>
        </div>
    )
}

onMounted(() => {
    const res = props.options.filter((item) => item.value)

    res.forEach((item, index) => {
        addQueryCondition(
            {
                ...item
            },
            item.valueLabel,
            index === res.length - 1
        )
        if (item.mode === 'input') {
            item.value = undefined
        }
    })
    if (res.length === 0) {
        handleQuery()
    }
})
</script>

<template>
    <SearchForm></SearchForm>
</template>
<style lang="scss" scoped>
@mixin content() {
    content: '';
    @apply block h-60% w-1px;
    background-color: var(--el-border-color);
    @content;
}
.search-container {
    @apply flex flex-col items-end;
}

:deep(.search) {
    @apply flex h-32px w-400px;
    border-radius: var(--el-border-radius-base);
    border: 1px var(--el-border-color) solid;
    .search-condition {
        @apply flex-y-center;
        &::after {
            @include content {
                @apply mr-10px;
            }
        }
    }
    .search-body {
        flex: 1;
        .el-select__suffix {
            display: none;
        }
    }
    .search-btn {
        @apply flex-center cursor-pointer pr-12px;
        color: var(--el-color-info-light-3);
        &::before {
            @include content {
                @apply mr-10px ml-10px;
            }
        }
    }
}

:deep(.condition) {
    @apply mt-10px flex-y-center gap-x-5px;
}

:deep(.el-select__wrapper),
:deep(.el-input__wrapper) {
    width: 100%;
    background-color: transparent;
    box-shadow: none !important;
}
</style>
