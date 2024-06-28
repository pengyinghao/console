import { io, Socket } from 'socket.io-client'
import { Emit, Events } from './event'

export class SocketService {
    private socket: Socket | undefined

    // eslint-disable-next-line no-use-before-define
    private static instance: SocketService | null = null

    private constructor() {
        this.createSocket()
    }

    private createSocket() {
        const socket = io(import.meta.env.VITE_BASE_URL, {
            transports: ['websocket'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 1000,
            extraHeaders: {
                token: 'xxx'
            },
            query: { token: 'your-token' }
        })
        this.socket = socket
    }

    /**  获取 socket 服务的实例  */
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

    /**  断开连接 */
    disconnect() {
        this.socket?.disconnect()
    }

    /** 连接 */
    connect() {
        this.socket?.connect()
    }
}
