import http from './http'

const handleError = (error, name) => {
  console.error(`❌ Lỗi khi fetch ${name}:`, error.message)
  throw error
}

const storeApi = {
  async fetchStores() {
    try {
      const { data } = await http.get('/stores')
      return data
    } catch (err) {
      handleError(err, 'stores')
    }
  },
}

export default storeApi