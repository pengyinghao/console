<script lang="ts" setup>
import { ref } from 'vue'
import { Select } from '@/components'
import { fetchTreeMenu } from '@/service/api/system/menu'

const value1 = ref('disabled')
const value2 = ref(1)
</script>
<template>
    <div>
        <div>角色管理</div>
        <Select v-model="value1" type-no="001" class="w-200px"></Select>
        <Select
            v-model="value2"
            :request-api="fetchTreeMenu"
            display-label="name"
            display-value="id"
        ></Select>
    </div>
</template>
