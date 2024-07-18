import { DirectiveBinding, ObjectDirective } from 'vue'

const MouseLeave: ObjectDirective = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        if (binding.value === false) return
        el.addEventListener('mouseleave', binding.value)
    },
    unmounted(el: HTMLElement, binding: DirectiveBinding) {
        el.removeEventListener('mouseleave', binding.value)
    }
}
export default MouseLeave
