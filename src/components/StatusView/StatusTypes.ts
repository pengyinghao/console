export enum Colors {
    primary = 'var(--color-primary)',
    enable = 'var(--el-color-success)',
    success = 'var(--el-color-success)',
    warning = 'var(--el-color-warning)',
    danger = 'var(--el-color-error)',
    fail = 'var(--el-color-error)',
    disabled = 'var(--el-color-error)',
    gray = 'var(--el-color-info)'
}

export type Status = keyof typeof Colors
