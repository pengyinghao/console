import { io, Socket } from 'socket.io-client'
import { Emit, Events } from './event'
import { useUserStore } from '@/store'

export class SocketService {
    private socket: Socket | undefined

    // eslint-disable-next-line no-use-before-define
    private static instance: SocketService | null = null

    private constructor() {
        this.createSocket()
    }

    private createSocket() {
        const userStore = useUserStore()
        const socket = io(import.meta.env.VITE_BASE_URL, {
            transports: ['websocket'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 1000 * 60, // 5分钟重试一次
            query: { userId: userStore.info.id }
        })

        // 重连，后端发出的消息
        socket.on('reconnectInstruction', () => {
            this.reconnect()
        })

        this.socket = socket
    }

    /** 获取 socket 服务的实例 */
    static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService()
        }
        return SocketService.instance
    }

    /**
     * 接收消息
     * @param eventName - 事件名称
     * @param listener - 事件处理函数
     */
    on<T extends keyof Events>(eventName: T, listener: (data: Events[T]) => void) {
        this.socket?.on(eventName as string, listener as (data: Events[T]) => void)
    }

    /**
     * 发送消息
     * @param eventName - 事件名称
     * @param data - 事件数据
     */
    emit<T extends keyof Emit>(eventName: T, data: Emit[T]) {
        this.socket?.emit(eventName, data)
    }

    /**
     * 一次性监听指定事件，当事件触发后，监听器会自动移除
     * @param eventName - 事件名称
     * @param listener - 事件处理函数
     */
    once<T extends keyof Events>(eventName: T, listener: (data: Events[T]) => void) {
        this.socket?.once(eventName as string, listener as (data: Events[T]) => void)
    }

    /**
     * 取消监听某个事件
     * @param eventName - 事件名称
     * @param listener - 事件处理函数，如果不传入，则默认会移除所有与 eventName 相关的事件监听器
     */
    off<T extends keyof Events>(eventName: T, listener?: (data: Events[T]) => void) {
        this.socket?.off(eventName as string, listener as (data: Events[T]) => void)
    }

    /** 断开连接 */
    private disconnect() {
        this.socket?.disconnect()
    }

    /** 连接 */
    private connect() {
        this.socket?.connect()
    }

    /** 重新连接 */
    private reconnect() {
        this.disconnect()
        setTimeout(() => {
            this.connect()
        }, 1000) // 延迟1秒后重连
    }
}
