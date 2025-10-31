// src/services/productService.js
import http from './http'

// Helper function để xử lý lỗi đơn giản
const handleError = (error, name) => {
  console.error(`❌ Lỗi khi fetch ${name}:`, error.message)
  throw error // Đẩy lỗi lên để Store có thể bắt
}

const productApi = {
  async fetchProducts() {
    try {
      const { data } = await http.get('/products')
      return data
    } catch (err) {
      handleError(err, 'products')
    }
  },

  async fetchCategories() {
    try {
      const { data } = await http.get('/categories')
      return data
    } catch (err) {
      handleError(err, 'categories')
    }
  },

  async fetchProductOptions() {
    try {
      const responses = await Promise.all([
        http.get('/toppings'),
        http.get('/sizes'),
        http.get('/sugarLevels'),
        http.get('/iceLevels'),
      ])
      return {
        toppings: responses[0].data,
        sizes: responses[1].data,
        sugarLevels: responses[2].data,
        iceLevels: responses[3].data,
      }
    } catch (err) {
      handleError(err, 'product options')
    }
  },
}

export default productApi