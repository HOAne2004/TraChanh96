import http from './http'

const handleError = (error, name) => {
  console.error(`❌ Lỗi khi fetch ${name}:`, error.message)
  throw error
}

const newsApi = {
  async fetchNews() {
    try {
      const { data } = await http.get('/news')
      return data
    } catch (err) {
      handleError(err, 'news')
    }
  },
}

export default newsApi