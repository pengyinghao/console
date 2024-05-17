<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()
const route = useRoute()
const { params, query } = route
const { path } = params

onMounted(() => {
    router.push({
        path: `/${path}`,
        query
    })
})
</script>

<template>
    <div></div>
</template>
