<script setup lang="ts">
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import locale from 'element-plus/es/locale/lang/zh-cn'
import PreferenceSetting from '@/layout/preferenceSetting/preferenceSetting.vue'
import { useChangeTheme } from './composables/useChangeTheme'

const appStore = useAppStore()

useChangeTheme()

window.$message = ElMessage
window.$messageBox = ElMessageBox
window.$notifiCation = ElNotification
</script>

<template>
    <Business>
        <el-config-provider :size="appStore.size" :locale="locale">
            <router-view></router-view>
            <!-- 偏好设置 -->
            <preference-setting v-model="appStore.showPreferenceSetting" />
        </el-config-provider>
    </Business>
</template>
