import { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard/analysis',
        component: () => import('@/layout/index.vue'),
        children: [
            {
                name: 'Info',
                path: '/info',
                component: () => import('@/views/system/userInfo/info/info.vue'),
                meta: {
                    name: '个人信息'
                }
            },
            {
                name: 'RoleUser',
                path: '/system/role-user/:id',
                component: () => import('@/views/system/role/roleUser.vue'),
                meta: {
                    name: '角色用户'
                }
            }
        ]
    },
    {
        path: '/test',
        component: () => import('@/views/test.vue')
    },
    {
        name: 'login',
        path: '/login',
        component: () => import('@/views/login/login.vue')
    },
    {
        name: '403',
        path: '/forbidden',
        component: () => import('@/views/common/forbidden.vue')
    },
    {
        path: '/redirect/:path(.*)',
        name: 'redirect',
        component: () => import('@/views/common/redirect.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/common/noFound.vue')
    }
]
