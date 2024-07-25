import { DirectiveBinding, ObjectDirective } from 'vue'
import { useUserStore } from '@/store'

const cachedPermissions = ref<string[]>([])

export const permissionDirective: ObjectDirective = {
    mounted(el: Element, binding: DirectiveBinding) {
        if (cachedPermissions.value.length === 0) {
            const userStore = useUserStore()
            cachedPermissions.value = userStore.buttons.map((button) => button.code) as string[]
        }

        const permissions = (binding.value as string).split(',') // 允许多个指令 ，用逗号分割
        const flag = permissions.some((item) => cachedPermissions.value.includes(item))

        if (!flag) {
            el.remove()
        }
    }
}
