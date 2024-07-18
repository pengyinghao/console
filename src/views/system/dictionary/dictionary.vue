<script lang="tsx" setup>
import DictType from './components/dictType.vue'
import Dict from './components/dict.vue'
defineOptions({ name: 'Dictionary' })
const activeName = ref('dictType')

const handleNavigation = () => {
    activeName.value = 'dict'
}
</script>

<template>
    <PageContainer>
        <el-tabs v-model="activeName">
            <el-tab-pane label="字典类型" name="dictType">
                <dict-type v-if="activeName === 'dictType'" @navigation="handleNavigation"></dict-type>
            </el-tab-pane>
            <el-tab-pane label="字典信息" name="dict">
                <dict v-if="activeName === 'dict'"></dict>
            </el-tab-pane>
        </el-tabs>
    </PageContainer>
</template>
