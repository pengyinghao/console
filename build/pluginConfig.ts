import { PluginOption } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
import viteCompression from 'vite-plugin-compression'
import eslintPlugin from 'vite-plugin-eslint'
import { visualizer } from 'rollup-plugin-visualizer'
import { autoImport, autoComponent } from './plugins/unplugin'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function pluginsConfig(isBuild: boolean) {
    const plugins: PluginOption[] = [vue(), vueJsx(), unocss()]

    plugins.push(viteCompression())
    plugins.push(autoImport())
    plugins.push(autoComponent())
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
