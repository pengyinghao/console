<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core'
import { CardItem, JobStatistics, ObjectStorage, UserUseTrend } from './components'
import { useAppStore } from '@/store'
defineOptions({ name: 'Analysis' })

const refJobStatistics = ref<InstanceType<typeof JobStatistics>>()
const refUserUseTrend = ref<InstanceType<typeof UserUseTrend>>()

const throttledFn = useDebounceFn(() => {
    refJobStatistics.value?.resize()
    refUserUseTrend.value?.resize()
}, 300)

watch(
    () => useAppStore().menuIsCollapse,
    () => throttledFn()
)
window.addEventListener('resize', throttledFn)

onUnmounted(() => {
    window.removeEventListener('reset', throttledFn)
})
</script>
<template>
    <div class="p-10px flex">
        <div class="flex-1 overflow-hidden">
            <el-row :gutter="20">
                <card-item icon-name="fa6-solid:user" icon-color="#40c9c6" label="总用户数" value="3201" />
                <card-item icon-name="lucide:locate" icon-color="#36a3f7" label="总访问数" value="1320" />
                <card-item icon-name="mdi:message-processing-outline" icon-color="#f4516c" label="消息" value="20" />
                <card-item icon-name="ph:bug-bold" icon-color="#e6a23c" label="异常日志" value="10" />
            </el-row>
            <!-- 作业实时统计 -->
            <job-statistics ref="refJobStatistics" class="mt-2px p-20px" />
            <!-- 对象存储 -->
            <object-storage class="mt-20px p-20px" />
            <!-- 用户使用趋势 -->
            <user-use-trend ref="refUserUseTrend" class="mt-20px p-20px" />
        </div>
    </div>
</template>
<style scoped>
:deep(.el-card) {
    box-shadow: 0 1px 13px 1px rgba(62, 72, 160, 10%);

    @apply w-full border-none;
}

:deep(.el-card__header) {
    @apply border-none;
}
</style>
