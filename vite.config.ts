import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import { pluginsConfig } from './build/pluginConfig'
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
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return id.toString().split('node_modules/')[1].replace('.pnpm/', '').split('/')[0]
                        }
                    }
                }
            },
            // sourcemap: true,
            brotliSize: false
        }
    }
})
