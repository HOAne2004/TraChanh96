// Dùng cho các dữ liệu cấu hình/tĩnh.
import http from './http'

const handleError = (error, name) => {
  console.error(`❌ Lỗi khi fetch ${name}:`, error.message)
  throw error
}

const appApi = {
  async fetchFooterInfo() {
    try {
      const { data } = await http.get('/footerInfo')
      return data
    } catch (err) {
      handleError(err, 'footerInfo')
    }
  },
  async fetchStorePolicies() {
    try {
      const { data } = await http.get('/storePolicies')
      return data
    } catch (err) {
      handleError(err, 'storePolicies')
    }
  },
  async fetchCarousel() {
    try {
      const { data } = await http.get('/carousel')
      return data
    } catch (error) {
      console.error('❌ Lỗi khi fetch carousel:', error.message)
      throw error
    }
  },
  async getAppConfig() {
    try {
      const { data } = await http.get('/appConfig')
      return data
    } catch (error) {
      throw error
    }
  },
}

export default appApi
