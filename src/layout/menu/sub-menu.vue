<script lang="ts" setup>
import { Icon } from '@/components'
import { SystemMenu } from '@/service/api/system/menu'

defineOptions({
    name: 'SubMenu'
})
defineProps<{ menu: SystemMenu }>()
</script>

<template>
    <el-sub-menu v-if="!menu.hidden" :index="`${menu.id}`">
        <template #title>
            <i v-if="menu.icon" class="flex-center mr-5px">
                <Icon :name="(menu.icon as string)"></Icon>
            </i>
            <span>{{ menu.name }}</span>
        </template>
        <template v-for="sub in menu.children" :key="sub.id">
            <!-- 判断是否隐藏菜单 -->
            <template v-if="!sub.hidden">
                <!-- 二级菜单 -->
                <el-menu-item
                    v-if="sub.children && sub.children.length === 0"
                    :index="`${sub.id}`"
                    class="aside-sub-menu"
                >
                    {{ sub.name }}
                </el-menu-item>
                <!-- 三级菜单及n级菜单 -->
                <sub-menu v-else :menu="sub" />
            </template>
        </template>
    </el-sub-menu>
</template>
