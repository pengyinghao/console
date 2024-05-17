import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

interface BusinessStore {
    /** 字典类型id,如果不为0，刷新字典信息页面 */
    dictTypeId: Ref<number | undefined>
}

export const useBusinessStore = defineStore('business', (): BusinessStore => {
    /** 字典类型id,如果不为0，刷新字典信息页面 */
    const dictTypeId = ref<number>()

    return {
        dictTypeId
    }
})
