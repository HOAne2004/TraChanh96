import { defineStore } from 'pinia'
import { ref } from 'vue'
import appApi from '@/apis/appApi'

export const useAppStore = defineStore('appStore', () => {
  const footerInfo = ref({})
  const storePolicies = ref([])
  const carousel = ref([])
  const appConfig = ref([])

  const fetchFooterInfo = async () => {
    // Nếu đã có dữ liệu, không gọi lại
    if (Object.keys(footerInfo.value).length > 0) return
    try {
      footerInfo.value = await appApi.fetchFooterInfo()
    } catch (error) {
      console.error('❌ Lỗi Store khi fetch footerInfo:', error)
    }
  }

  const fetchStorePolicies = async () => {
    if (storePolicies.value.length) return
    try {
      storePolicies.value = await appApi.fetchStorePolicies()
    } catch (error) {
      console.error('❌ Lỗi Store khi fetch storePolicies:', error)
    }
  }

  const fetchCarousel = async () => {
    if (carousel.value.length) return
    try {
      carousel.value = await appApi.fetchCarousel()
    } catch (error) {
      console.error('❌ Lỗi Store khi fetch carousel:', error)
    }
  }
  const fetchAppConfig = async () => {
    if (Object.keys(appConfig.value).length) return
    try {
      const data = await appApi.getAppConfig()
      appConfig.value = data
    } catch (err) {
      console.error('Lỗi tải cấu hình App:', err)
    }
  }
  return {
    footerInfo,
    storePolicies,
    carousel,
    appConfig,
    fetchFooterInfo,
    fetchStorePolicies,
    fetchCarousel,
    fetchAppConfig,
  }
})
