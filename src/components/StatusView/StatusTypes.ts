export enum Colors {
    primary = 'var(--color-primary)',
    success = 'var(--el-color-success)',
    warning = 'var(--el-color-warning)',
    danger = 'var(--el-color-error)',
    gray = 'var(--el-color-info)'
}

export type StatusType = keyof typeof Colors
