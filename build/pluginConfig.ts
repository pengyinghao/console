import { PluginOption } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
import viteCompression from 'vite-plugin-compression'
import eslintPlugin from 'vite-plugin-eslint'
import { createHtmlPlugin } from 'vite-plugin-html'
import { visualizer } from 'rollup-plugin-visualizer'
import { cdn } from './plugins/cdn'
// import { autoImport, autoComponent } from './plugins/unplugin'

export function pluginsConfig(isBuild: boolean) {
    const plugins: PluginOption[] = [vue(), vueJsx(), unocss()]

    plugins.push(viteCompression())

    plugins.push(
        createHtmlPlugin({
            inject: {
                data: {
                    cdncss: isBuild ? cdn.css : [],
                    cdnjs: isBuild ? cdn.js : []
                }
            }
        })
    )

    // plugins.push(autoImport())
    // plugins.push(autoComponent())
    plugins.push(eslintPlugin())
    plugins.push(
        visualizer({
            emitFile: false,
            filename: 'report.html',
            open: false
        }) as any
    )
    return plugins
}
