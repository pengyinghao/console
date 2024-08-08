<script lang="ts" setup>
import Item from './item.vue'
import UpdateAvatar from './components/updateAvatar.vue'
import UpdatePassword from './components/updatePassword.vue'
import { useCompRef } from '@/composables/useCompRef'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { info } = toRefs(userStore)

const refUpdateAvatar = useCompRef(UpdateAvatar)
const handleUpdateAvatar = () => {
    refUpdateAvatar.value?.showModal()
}

/** 修改密码 */
const refUpdatePassword = useCompRef(UpdatePassword)
const handleUpdatePassword = () => {
    window.$message({ type: 'warning', message: '修改密码功能暂未开放' })
    // refUpdatePassword.value?.showModal()
}
</script>

<template>
    <PageContainer>
        <div class="flex-y-center">
            <el-avatar :size="60" :src="info.avatar" class="cursor-pointer" @click="handleUpdateAvatar" />
            <div class="ml-25px">
                <div>用户名：{{ info.account }}</div>
                <div class="mt-10px flex-y-center">
                    <icon name="mingcute:safe-shield-2-fill"></icon>
                    <span class="ml-2px">可使用用户名加密码的方式进行登录</span>
                </div>
            </div>
        </div>
        <!-- 登录密码 -->
        <Item icon="ep:lock" title="登录密码" @click="handleUpdatePassword">
            安全性高的密码可以使账号更安全，建议您定期更换密码，设置一个长度为8~12位，必须包含大小写字母、数字、特殊字符
            (~!@#$%^&*?),不能与用户名相同
        </Item>
        <!-- 手机绑定 -->
        <Item icon="ep:iphone" title="手机绑定">
            你已经绑定了手机：{{ info.phone }},您的手机为安全手机，可以找回密码
        </Item>
        <!-- 绑定邮箱 -->
        <Item
            icon="ic:outline-email"
            title="绑定邮箱"
            :btn-text="info.email ? '修改' : '绑定'"
            :btn-icon="info.email ? 'ep:edit-pen' : 'ep:plus'"
        >
            <template v-if="info.email">
                您已经绑定了邮箱，{{ info.email }}，将方便您获取系统消息、重置密码等
            </template>
            <template v-else> 您未绑定邮箱，如需要绑定，请单击绑定,将方便您获取系统消息、重置密码等 </template>
        </Item>

        <!-- 修改头像 -->
        <update-avatar ref="refUpdateAvatar"></update-avatar>
        <!-- 修改密码 -->
        <update-password ref="refUpdatePassword"></update-password>
    </PageContainer>
</template>
