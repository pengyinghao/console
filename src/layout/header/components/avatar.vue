<script lang="ts" setup>
import { useAppStore, useTabStore, useUserStore } from '@/store'
defineOptions({
    name: 'Avatar'
})

const appStore = useAppStore()
const userStore = useUserStore()
const tabStore = useTabStore()
const router = useRouter()
const { info } = toRefs(userStore)
const onCommand = (value: 'preferenceSetting' | 'loginOut' | 'info') => {
    if (value === 'info') {
        return router.push('/info')
    }
    if (value === 'loginOut') {
        tabStore.reset()
        return userStore.loginOut()
    }
    if (value === 'preferenceSetting') {
        appStore.showPreferenceSetting = true
    }
}
</script>

<template>
    <el-dropdown @command="onCommand">
        <div class="h-full flex flex-center username">
            <el-avatar :size="26" :src="info.avatar" />
            <span class="pl-10px c-[var(--el-text-color-regular)]">{{ info.name }}</span>
        </div>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item command="info">
                    <Icon name="ep:user"></Icon>
                    <span class="ml-5px">个人信息</span>
                </el-dropdown-item>
                <el-dropdown-item command="preferenceSetting">
                    <Icon name="ep:setting"></Icon>
                    <span class="ml-5px">偏好设置</span>
                </el-dropdown-item>
                <el-dropdown-item command="loginOut">
                    <Icon name="ep:switch-button"></Icon>
                    <span class="ml-5px">退出登录</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
