import { defineStore } from 'pinia'
import { ref } from 'vue'
import storeApi from '@/apis/storeApi' // Import Service
import { useModalStore } from './modalStore'

export const useStoreStore = defineStore('storeStore', () => {
  // Stores
  const modalStore = useModalStore()

  const stores = ref([])
  const storeLoading = ref(false)
  const storeError = ref(null)

  //READ
  const fetchStores = async () => {
    if (stores.value.length) return

    storeLoading.value = true
    storeError.value = null
    try {
      stores.value = await storeApi.fetchStores()
    } catch (error) {
      storeError.value = error.message || 'Lỗi khi tải danh sách cửa hàng.'
      console.error('Lỗi Store:', error)
      modalStore.showToast(storeError.value, 'error')
    } finally {
      storeLoading.value = false
    }
  }
  // --- ADMIN CRUD ACTIONS ---

  /**
   * 2. CREATE: Thêm chi nhánh mới
   */
  const createStoreAction = async (storeData) => {
    storeLoading.value = true
    storeError.value = null
    try {
      const createdStore = await storeApi.createStore(storeData)

      // Cập nhật State
      stores.value.unshift(createdStore)
      modalStore.showToast('Thêm chi nhánh thành công!', 'success')
      return createdStore
    } catch (error) {
      storeError.value = 'Không thể thêm chi nhánh.'
      modalStore.showToast(storeError.value, 'error')
      throw error
    } finally {
      storeLoading.value = false
    }
  }

  /**
   * 3. UPDATE: Cập nhật chi nhánh
   */
  const updateStoreAction = async (id, updatedData) => {
    storeLoading.value = true
    storeError.value = null
    try {
      const updatedStore = await storeApi.updateStore(id, updatedData)

      // Cập nhật State: Tìm và thay thế cửa hàng cũ
      const index = stores.value.findIndex((s) => String(s.id) === String(id))
      if (index !== -1) {
        stores.value[index] = updatedStore
      }

      modalStore.showToast('Cập nhật chi nhánh thành công!', 'success')
      return updatedStore
    } catch (error) {
      storeError.value = 'Không thể cập nhật chi nhánh.'
      modalStore.showToast(storeError.value, 'error')
      throw error
    } finally {
      storeLoading.value = false
    }
  }

  /**
   * 4. DELETE: Xóa chi nhánh
   */
  const deleteStoreAction = async (id) => {
    storeLoading.value = true
    storeError.value = null
    try {
      await storeApi.deleteStore(id)

      // Cập nhật State: Lọc bỏ cửa hàng đã xóa
      stores.value = stores.value.filter((s) => String(s.id) !== String(id))

      modalStore.showToast('Xóa chi nhánh thành công!', 'success')
      return true
    } catch (error) {
      storeError.value = 'Không thể xóa chi nhánh.'
      modalStore.showToast(storeError.value, 'error')
      throw error
    } finally {
      storeLoading.value = false
    }
  }

  return {
    stores,
    storeLoading,
    storeError,
    fetchStores,
    createStoreAction,
    updateStoreAction,
    deleteStoreAction,
  }
})
