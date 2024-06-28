<script lang="ts" setup>
import { SocketService } from '@/socket'
const websocketInstance = SocketService.getInstance()
websocketInstance.on('test', (data) => {
    console.log(data)
})

const handleClick = () => {
    websocketInstance.emit('test', '测试')
}
</script>
<template>
    <div class="p-10px">
        工作台
        <div class="mt-10px">
            <el-button type="primary" @click="handleClick">websocket发送消息</el-button>
        </div>
    </div>
</template>
