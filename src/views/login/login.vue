<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchCaptcha } from '@/service/api/common'
import { login } from '@/service/api/auth'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/core/constant'
import { Icon } from '@/components'
interface FormData {
    /** 账号 */
    account: string
    /** 密码 */
    password: string
    /** 验证码 */
    code: string
}

const formData = reactive<FormData>({
    account: 'admin',
    password: '123456',
    code: ''
})

const captcha = ref('')
const getCaptcha = async () => {
    const captchaResult = await fetchCaptcha()
    const blob = new Blob([captchaResult.data], { type: 'image/svg+xml' })
    const fileReader = new FileReader()
    fileReader.readAsDataURL(blob)
    fileReader.onloadend = (e: any) => {
        captcha.value = e.target.result
    }
}
getCaptcha()

/** 密码是否可见 */
const passwordIsVisible = ref(false)
const loading = ref(false)

const router = useRouter()
/** 登录 */
const onLogin = async () => {
    if (!formData.account) return window.$message.warning('请输入账号')

    if (!formData.password) return window.$message.warning('请输入密码')
    if (!formData.code) return window.$message.warning('请输入验证码')
    loading.value = true
    try {
        const result = await login(formData)
        sessionStorage.setItem(ACCESS_TOKEN, result.access_token)
        sessionStorage.setItem(REFRESH_TOKEN, result.refresh_token)
    } finally {
        loading.value = false
    }

    router.push({ path: '/' })
}
</script>
<template>
    <div class="login flex-center h-100vh">
        <div class="login-form bg-white w-458px h-569px rounded-12px p-40px pt-20px">
            <h2 class="text-size-32px text-center color-#232859 font-400">登录</h2>
            <el-form class="mt-40px" label-position="top">
                <el-form-item label="用户名">
                    <el-input v-model="formData.account" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input
                        v-model="formData.password"
                        :type="passwordIsVisible ? 'text' : 'password'"
                        placeholder="请输入密码"
                    >
                        <template #suffix>
                            <Icon
                                v-show="!passwordIsVisible"
                                class="cursor-pointer"
                                name="ep:view"
                                @click="passwordIsVisible = !passwordIsVisible"
                            ></Icon>
                            <Icon
                                v-show="passwordIsVisible"
                                class="cursor-pointer"
                                name="ep:hide"
                                @click="passwordIsVisible = !passwordIsVisible"
                            ></Icon>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="flex items-center mt-28px">
                    <el-input v-model="formData.code" placeholder="请输入验证码"></el-input>
                    <div
                        class="captcha w-150px h-32px ml-34px border border-#DCDFE6 rounded-4px cursor-pointer"
                        @click="getCaptcha"
                    >
                        <img :src="captcha" class="h-full" />
                    </div>
                </div>
            </el-form>
            <div class="text-right color-#999 mt-18px cursor-pointer">
                <el-link type="info" :underline="false" class="font-400">忘记密码</el-link>
            </div>
            <el-button v-loading="loading" type="primary" class="w-100% mt-40px" @click="onLogin">
                登录
            </el-button>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.login {
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.login-form {
    box-shadow: 0 0 30px 1px rgba(62, 72, 160, 12%);

    .icon {
        user-select: none;
    }
}

svg {
    width: 100% !important;
    height: 32px;
}

:deep(.el-form-item .el-form-item__label) {
    color: #000;
}
</style>
