import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import externalGlobals from 'rollup-plugin-external-globals'
import { pluginsConfig } from './build/pluginConfig'
import { externalGlobalsObj, externalKeys } from './build/plugins/cdn'
export default defineConfig(({ command, mode }) => {
    const envs = loadEnv(mode, process.cwd(), ['VITE_BASE_URL'])
    return {
        plugins: pluginsConfig(command === 'build'),
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src')
            }
        },
        server: {
            host: '0.0.0.0',
            port: 9001,
            proxy: {
                '/api': {
                    secure: false,
                    target: envs.VITE_BASE_URL,
                    changeOrigin: true
                }
            }
        },
        css: {
            devSourcemap: true
        },
        build: {
            outDir: 'dist',
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return 'vendor'
                        }
                    },
                    // 拆分js到模块文件夹
                    chunkFileNames: ({ facadeModuleId }) => {
                        const moduleId = facadeModuleId ? facadeModuleId.split('/') : []
                        const fileName = moduleId[moduleId.length - 2] || '[name]'
                        return `js/${fileName}/[name].[hash].js`
                    },
                    entryFileNames: 'js/[name]-[hash].js',
                    assetFileNames: '[ext]/[name].[hash:4].[ext]'
                },
                external: externalKeys,
                plugins: [externalGlobals(externalGlobalsObj)]
            },
            // sourcemap: true,
            brotliSize: false
        }
    }
})
