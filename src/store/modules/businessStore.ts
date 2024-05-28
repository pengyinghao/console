import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBusinessStore = defineStore('business', () => {
    /** 字典类型id,如果不为0，刷新字典信息页面 */
    const dictTypeId = ref<number>()
    const dictTypeName = ref<string>()

    return {
        dictTypeId,
        dictTypeName
    }
})
