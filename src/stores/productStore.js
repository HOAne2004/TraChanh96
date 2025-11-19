import { defineStore } from 'pinia'
import { ref } from 'vue'
import productApi from '@/api/productApi' // Import Service
import { useModalStore } from './modalStore'

export const useProductStore = defineStore('productStore', () => {
  // 🧩 STATE
  const products = ref([])
  const categories = ref([])
  const toppings = ref([])
  const sizes = ref([])
  const sugarLevels = ref([])
  const iceLevels = ref([])
  const productLoading = ref(false) // Thêm biến loading
  const productError = ref(null)
  
  // Modal store for notifications
  const modalStore = useModalStore()

  // 📦 ACTIONS
  // 1. READ (Đã có, giữ nguyên, nhưng đổi tên thành fetchAllData cho rõ ràng)
  const fetchProduct = async () => {
    if (products.value.length) return

    productLoading.value = true
    try {
      // 🚨 GỌI SERVICE
      products.value = await productApi.fetchProducts()
      categories.value = await productApi.fetchCategories()

      const options = await productApi.fetchProductOptions()
      toppings.value = options.toppings
      sizes.value = options.sizes
      sugarLevels.value = options.sugarLevels
      iceLevels.value = options.iceLevels
    } catch (error) {
      // Xử lý lỗi (ví dụ: hiển thị Toast)
      console.error('Lỗi Store:', error)
    } finally {
      productLoading.value = false
    }
  }

  // --- ACTIONS CRUD ADMIN ---

  /**
   * 2. CREATE: Thêm sản phẩm mới (POST /products)
   * @param {object} newProductData - Dữ liệu sản phẩm mới
   */
  const createProductAction = async (newProductData) => {
    productLoading.value = true
    productError.value = null
    try {
      // 🚨 GỌI SERVICE POST
      const createdProduct = await productApi.createProduct(newProductData)

      // Cập nhật State: Thêm sản phẩm mới vào đầu danh sách
      products.value.unshift(createdProduct)

      modalStore.showToast('Tạo sản phẩm thành công!', 'success')
      return createdProduct
    } catch (error) {
      productError.value = 'Không thể tạo sản phẩm.'
      modalStore.showToast(productError.value, 'error')
      throw error // Ném lỗi để component có thể xử lý
    } finally {
      productLoading.value = false
    }
  }

  /**
   * 3. UPDATE: Cập nhật thông tin sản phẩm (PUT/PATCH /products/:id)
   * @param {string} id - ID sản phẩm
   * @param {object} updatedData - Dữ liệu cần cập nhật
   */
  const updateProductAction = async (id, updatedData) => {
    productLoading.value = true
    productError.value = null
    try {
      // 🚨 GỌI SERVICE PUT/PATCH
      const updatedProduct = await productApi.updateProduct(id, updatedData)

      // Cập nhật State: Tìm và thay thế sản phẩm cũ
      const index = products.value.findIndex((p) => String(p.id) === String(id))
      if (index !== -1) {
        // Thay thế sản phẩm cũ bằng dữ liệu mới nhất từ server
        products.value[index] = updatedProduct
      }

      modalStore.showToast('Cập nhật sản phẩm thành công!', 'success')
      return updatedProduct
    } catch (error) {
      productError.value = 'Không thể cập nhật sản phẩm.'
      modalStore.showToast(productError.value, 'error')
      throw error
    } finally {
      productLoading.value = false
    }
  }

  /**
   * 4. DELETE: Xóa sản phẩm (DELETE /products/:id)
   * @param {string} id - ID sản phẩm cần xóa
   */
  const deleteProductAction = async (id) => {
    productLoading.value = true
    productError.value = null
    try {
      // 🚨 GỌI SERVICE DELETE
      await productApi.deleteProduct(id)

      // Cập nhật State: Lọc bỏ sản phẩm đã xóa
      products.value = products.value.filter((p) => String(p.id) !== String(id))

      modalStore.showToast('Xóa sản phẩm thành công!', 'success')
    } catch (error) {
      productError.value = 'Không thể xóa sản phẩm.'
      modalStore.showToast(productError.value, 'error')
      throw error
    } finally {
      productLoading.value = false
    }
  }

  // 🔁 EXPORT
  return {
    // data
    products,
    categories,
    toppings,
    sizes,
    sugarLevels,
    iceLevels,
    productLoading,
    productError,

    // actions
    fetchProduct,
    createProductAction,
    updateProductAction,
    deleteProductAction,
  }
})
