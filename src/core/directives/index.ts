import { App } from 'vue'
import { permissionDirective } from './permission'

export function setupDirective(app: App) {
    app.directive('permission', permissionDirective)
}
