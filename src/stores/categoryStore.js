// src/stores/categoryStore.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as categoryApi from '@/apis/categoryApi' // Giả định bạn đã tạo file này
import { useModalStore } from './modalStore'

export const useCategoryStore = defineStore('categoryStore', () => {
  // 🧩 STATE
  const categories = ref([]) // Danh sách phẳng (dùng cho bảng)
  const categoryTree = ref([]) // Danh sách cấu trúc cây (dùng cho dropdown/menu)
  const isLoading = ref(false)
  const error = ref(null)

  const modalStore = useModalStore()

  // 📦 ACTIONS

  /**
   * Tải danh sách Categories (phẳng) từ API
   */
  async function fetchCategories(params = {}) {
    isLoading.value = true
    error.value = null
    try {
      // 1. Tải danh sách phẳng (sử dụng API base GET /api/categories)
      const flatList = await categoryApi.fetchFlatCategories(params) // Giả định tên hàm trong API
      categories.value = flatList

      // 2. Tải cấu trúc cây (sử dụng API GET /api/categories/tree)
      const tree = await categoryApi.fetchCategoryTree() // Giả định tên hàm trong API
      categoryTree.value = tree

      return flatList
    } catch (err) {
      error.value = err?.message || 'Không thể tải danh sách danh mục.'
      modalStore.showToast(error.value, 'error')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * HÀM CRUD CƠ BẢN
   */

  // ⭐️ CREATE: Tạo danh mục mới
  async function createCategoryAction(categoryDto) {
    isLoading.value = true
    error.value = null
    try {
      const newCategory = await categoryApi.createCategory(categoryDto)

      // Cập nhật State: Thêm vào danh sách phẳng và tải lại cây
      categories.value.unshift(newCategory)
      await fetchCategories() // Tải lại để cập nhật cấu trúc cây

      modalStore.showToast('Tạo danh mục thành công!', 'success')
      return newCategory
    } catch (err) {
      error.value = err?.message || 'Tạo danh mục thất bại.'
      modalStore.showToast(error.value, 'error')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ⭐️ DELETE: Xóa danh mục
  async function deleteCategoryAction(id) {
    isLoading.value = true
    error.value = null
    try {
      await categoryApi.deleteCategory(id)

      // Cập nhật State: Xóa khỏi danh sách phẳng và tải lại cây
      categories.value = categories.value.filter((c) => c.id !== id)
      await fetchCategories() // Tải lại để cập nhật cấu trúc cây

      modalStore.showToast('Xóa danh mục thành công!', 'success')
      return true
    } catch (err) {
      error.value = err?.message || 'Xóa danh mục thất bại.'
      modalStore.showToast(error.value, 'error')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ⭐️ UPDATE: Cập nhật danh mục (TODO: Cần logic tải lại)
  // ⭐️ UPDATE: Cập nhật danh mục
  async function updateCategoryAction(id, categoryDto) {
    isLoading.value = true
    error.value = null
    try {
      const updatedCategory = await categoryApi.updateCategory(id, categoryDto)

      // Cập nhật State: Thay thế category trong danh sách phẳng
      categories.value = categories.value.map((c) => (c.id === id ? updatedCategory : c))
      await fetchCategories() // Tải lại để cập nhật cấu trúc cây

      modalStore.showToast('Cập nhật danh mục thành công!', 'success')
      return updatedCategory
    } catch (err) {
      error.value = err?.message || 'Cập nhật danh mục thất bại.'
      modalStore.showToast(error.value, 'error')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ⭐️ GET BY ID: Lấy chi tiết danh mục theo ID
  async function getCategoryByIdAction(id) {
    isLoading.value = true
    error.value = null
    try {
      const category = await categoryApi.fetchCategoryById(id)
      return category
    } catch (err) {
      error.value = err?.message || 'Lấy thông tin danh mục thất bại.'
      modalStore.showToast(error.value, 'error')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 🔁 EXPORT
  return {
    categories,
    categoryTree,
    isLoading,
    error,
    fetchCategories,
    createCategoryAction,
    deleteCategoryAction,
    updateCategoryAction,
    getCategoryByIdAction,
    // ... (các hàm CRUD khác)
  }
})
