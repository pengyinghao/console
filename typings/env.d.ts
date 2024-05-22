declare interface ImportMetaEnv {
    /** 请求地址ip */
    VITE_BASE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
