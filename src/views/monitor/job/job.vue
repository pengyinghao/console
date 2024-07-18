<script lang="tsx" setup>
import JobList from './components/jobList.vue'
import JobLog from './components/jobLog.vue'
defineOptions({ name: 'Job' })

const activeName = ref('job')
const handleNavigation = () => {
    activeName.value = 'jobLog'
}
</script>

<template>
    <PageContainer>
        <el-tabs v-model="activeName">
            <el-tab-pane label="任务管理" name="job">
                <JobList v-if="activeName === 'job'" @navigation="handleNavigation"></JobList>
            </el-tab-pane>
            <el-tab-pane label="任务日志" name="jobLog">
                <JobLog v-if="activeName === 'jobLog'"></JobLog>
            </el-tab-pane>
        </el-tabs>
    </PageContainer>
</template>
