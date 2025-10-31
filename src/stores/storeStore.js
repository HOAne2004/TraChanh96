import { defineStore } from 'pinia'
import { ref } from 'vue'
import storeApi from '@/api/storeApi' // Import Service

export const useStoreStore = defineStore('storeStore', () => {
  const stores = ref([])
  const storeLoading = ref(false)

  const fetchStores = async () => {
    if (stores.value.length) return

    storeLoading.value = true
    try {
      stores.value = await storeApi.fetchStores()
    } catch (error) {
      console.error("Lỗi Store:", error)
    } finally {
      storeLoading.value = false
    }
  }

  return { stores, storeLoading, fetchStores }
})