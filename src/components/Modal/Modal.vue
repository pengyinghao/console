<script lang="ts" setup></script>
<template>
    <el-dialog :close-on-click-modal="false" v-bind="$attrs">
        <template #header>
            <slot name="header"></slot>
        </template>
        <slot></slot>
        <template #footer>
            <slot name="footer"></slot>
        </template>
    </el-dialog>
</template>
<style>
.el-dialog {
    @apply dark:bg-#252a2f;
}
</style>
