<script lang="ts" setup>
import { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'

defineOptions({ name: 'Breadcrumb' })
const route = useRoute()

const routes = ref<RouteRecordRaw[]>([])
/** 设置面包屑数据 */
const setBreadCrumbData = (routeLocationMatched: RouteLocationNormalizedLoaded) => {
    if (routeLocationMatched.path !== '/dashboard') {
        routes.value = routeLocationMatched.matched
    } else {
        routes.value = []
    }
}
watch(route, (newValue) => setBreadCrumbData(newValue))
onMounted(() => setBreadCrumbData(route))
</script>

<template>
    <el-breadcrumb separator="/">
        <template v-for="(item, index) in routes" :key="index">
            <el-breadcrumb-item v-if="item.meta?.name" :to="{ path: item.path }">
                <div class="h-16px flex items-center">
                    <Icon v-if="item.meta?.icon" :name="item.meta.icon" />
                    <span class="ml-5px">{{ item.meta?.name }}</span>
                </div>
            </el-breadcrumb-item>
        </template>
    </el-breadcrumb>
</template>
