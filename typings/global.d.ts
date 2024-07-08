interface Window {
    $message: import('element-plus').Message
    $messageBox: import('element-plus').IElMessageBox
    $notifiCation: import('element-plus').Notify
}

/** 设置某些字段 只读 */
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
