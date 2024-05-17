export const cdn = {
    css: ['element-plus/index'],
    js: [
        { name: 'vue', var: 'Vue' },
        { name: 'vue-router', var: 'VueRouter' },
        { name: 'vue-demi', var: 'VueDemi' },
        { name: 'pinia', var: 'Pinia' },
        { name: 'element-plus', var: 'ElementPlus', path: 'element-plus/index' },
        { name: 'axios', var: 'axios' }
    ]
}

export const externalKeys = cdn.js.map((item) => item.name)

export const externalGlobalsObj = cdn.js.reduce((prev, curr) => {
    prev[curr.name] = curr.var
    return prev
}, {})
