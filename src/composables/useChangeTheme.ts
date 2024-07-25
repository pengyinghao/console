import { useAppStore } from '@/store'
import { isDark } from '@/utils'
import { changeTheme } from '@/utils/theme'

export function useChangeTheme() {
    const appStore = useAppStore()

    const setBodyClass = () => {
        let theme = 'light'
        if (appStore.followSystemTheme) {
            if (isDark()) {
                theme = 'dark'
            }
        } else {
            theme = appStore.themeMode
        }
        document.documentElement.className = theme
        changeTheme(appStore.theme)
    }

    watch(
        () => [appStore.themeMode, appStore.followSystemTheme],
        () => {
            setBodyClass()
        },
        { immediate: true }
    )
}
