import { defineStore } from 'pinia'
import { ref } from 'vue'
import newsApi from '@/apis/newsApi' // Import Service
import { useModalStore } from './modalStore'

export const useNewsStore = defineStore('newsStore', () => {
  // Stores
  const modalStore = useModalStore()

  const news = ref([])
  const newsLoading = ref(false)
  const newsError = ref(null)

  const fetchNews = async () => {
    if (news.value.length) return

    newsLoading.value = true
    newsError.value = null
    try {
      news.value = await newsApi.fetchNews()
    } catch (error) {
      newsError.value = error.message || 'Lỗi khi tải danh sách tin tức.'
      console.error('Lỗi Store:', error)
      modalStore.showToast(newsError.value, 'error')
    } finally {
      newsLoading.value = false
    }
  }
  // --- ADMIN CRUD ACTIONS ---

  /**
   * 2. CREATE: Thêm tin tức mới
   */
  const createNewsAction = async (newsData) => {
    newsLoading.value = true
    newsError.value = null
    try {
      const createdNews = await newsApi.createNews(newsData)

      // Cập nhật State
      news.value.unshift(createdNews)
      modalStore.showToast('Thêm tin tức thành công!', 'success')
      return createdNews
    } catch (error) {
      newsError.value = 'Không thể thêm tin tức.'
      modalStore.showToast(newsError.value, 'error')
      throw error
    } finally {
      newsLoading.value = false
    }
  }

  /**
   * 3. UPDATE: Cập nhật tin tức
   */
  const updateNewsAction = async (id, updatedData) => {
    newsLoading.value = true
    newsError.value = null
    try {
      const updatedNews = await newsApi.updateNews(id, updatedData)

      // Cập nhật State: Tìm và thay thế tin tức cũ
      const index = news.value.findIndex((n) => String(n.id) === String(id))
      if (index !== -1) {
        news.value[index] = updatedNews
      }

      modalStore.showToast('Cập nhật tin tức thành công!', 'success')
      return updatedNews
    } catch (error) {
      newsError.value = 'Không thể cập nhật tin tức.'
      modalStore.showToast(newsError.value, 'error')
      throw error
    } finally {
      newsLoading.value = false
    }
  }

  /**
   * 4. DELETE: Xóa tin tức
   */
  const deleteNewsAction = async (id) => {
    newsLoading.value = true
    newsError.value = null
    try {
      await newsApi.deleteNews(id)

      // Cập nhật State: Lọc bỏ tin tức đã xóa
      news.value = news.value.filter((n) => String(n.id) !== String(id))

      modalStore.showToast('Xóa tin tức thành công!', 'success')
      return true
    } catch (error) {
      newsError.value = 'Không thể xóa tin tức.'
      modalStore.showToast(newsError.value, 'error')
      throw error
    } finally {
      newsLoading.value = false
    }
  }

  return {
    news,
    newsLoading,
    newsError,
    fetchNews,
    createNewsAction,
    updateNewsAction,
    deleteNewsAction,
  }
})
