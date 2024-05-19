interface Window {
    $message: import('element-plus').Message
    $messageBox: import('element-plus').IElMessageBox
    $notifiCation: import('element-plus').Notify
}

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
