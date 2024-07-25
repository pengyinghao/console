import { Directive } from 'vue'

declare module '@vue/runtime-core' {
    interface ComponentCustomDirectives {
        permission: Directive<Element, string>
    }
}

export {}
