// src/api/appApi.js
import api from './index'

const handleError = (error, name) => {
  console.error(`❌ Lỗi khi fetch ${name}:`, error.message)
  throw error
}

const appApi = {
  async fetchFooterInfo() {
    try {
      const { data } = await api.get('/footerInfo')
      return data
    } catch (err) {
      handleError(err, 'footerInfo')
    }
  },
  async fetchStorePolicies() {
    try {
      const { data } = await api.get('/storePolicies')
      return data
    } catch (err) {
      handleError(err, 'storePolicies')
    }
  },
  async fetchCarousel() {
    try {
      const { data } = await api.get('/carousel')
      return data
    } catch (error) {
      console.error('❌ Lỗi khi fetch carousel:', error.message)
      throw error
    }
  },
  async getAppConfig() {
    try {
      const { data } = await api.get('/appConfig')
      return data
    } catch (error) {
      console.error('❌ Lỗi khi fetch appConfig:', error.message)
      throw error
    }
  },
}

export default appApi
