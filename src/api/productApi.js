import http from './http'

const PRODUCTS_ENPOINT = '/products'

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

  // --- ADMIN CRUD ACTIONS (BỔ SUNG) ---

  /**
   * TẠO: Tạo sản phẩm mới (POST /products)
   * @param {object} productData - Dữ liệu sản phẩm mới
   */
  async createProduct(productData) {
    try {
      const { data } = await http.post(PRODUCTS_ENDPOINT, productData)
      return data
    } catch (err) {
      // Đặt tên lỗi rõ ràng để dễ debug ở Store
      handleError(err, 'tạo sản phẩm mới')
    }
  },

  /**
   * CẬP NHẬT: Cập nhật thông tin sản phẩm (PUT /products/:id)
   * @param {string} id - ID sản phẩm
   * @param {object} productData - Dữ liệu cần cập nhật
   */
  async updateProduct(id, productData) {
    try {
      // Json-server sử dụng PUT để cập nhật toàn bộ resource
      const { data } = await http.put(`${PRODUCTS_ENDPOINT}/${id}`, productData)
      return data
    } catch (err) {
      handleError(err, `cập nhật sản phẩm ID ${id}`)
    }
  },

  /**
   * XÓA: Xóa sản phẩm (DELETE /products/:id)
   * @param {string} id - ID sản phẩm
   */
  async deleteProduct(id) {
    try {
      // Không cần trả về data, chỉ cần xác nhận request thành công
      await http.delete(`${PRODUCTS_ENDPOINT}/${id}`)
      return true
    } catch (err) {
      handleError(err, `xóa sản phẩm ID ${id}`)
    }
  },
}

export default productApi
