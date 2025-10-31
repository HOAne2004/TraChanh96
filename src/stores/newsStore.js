import { defineStore } from 'pinia'
import { ref } from 'vue'
import newsApi from '@/api/newsApi' // Import Service

export const useNewsStore = defineStore('newsStore', () => {
  const news = ref([])
  const newsLoading = ref(false)

  const fetchNews = async () => {
    if (news.value.length) return

    newsLoading.value = true
    try {
      news.value = await newsApi.fetchNews()
    } catch (error) {
      console.error("Lỗi Store:", error)
    } finally {
      newsLoading.value = false
    }
  }

  return { news, newsLoading, fetchNews }
})