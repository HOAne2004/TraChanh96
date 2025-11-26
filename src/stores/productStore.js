import { defineStore } from 'pinia'
import { ref } from 'vue'
import productApi from '@/apis/productApi' // Import Service
import { useModalStore } from './modalStore'
//import { fetchAllOrdersForAdmin } from '@/apis/orderApi'

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
  const fetchAllProductData = async () => {
    if (products.value.length) return

    productLoading.value = true
    try {
      // 🚨 GỌI SERVICE: Tải list sản phẩm chính (Beverage) và các bảng phụ

      const productListPromise = productApi.fetchProducts({ productType: 'Beverage' })
      const categoriesPromise = productApi.fetchCategories()
      const optionsPromise = productApi.fetchProductOptions() // Hàm này tải Topping, Size, Sugar, Ice

      // Đợi tất cả Promise hoàn thành cùng lúc
      const [productList, categoryList, options] = await Promise.all([
        productListPromise,
        categoriesPromise,
        optionsPromise,
      ])

      // Cập nhật State
      products.value = productList
      categories.value = categoryList

      toppings.value = options.toppings
      sizes.value = options.sizes
      sugarLevels.value = options.sugarLevels
      iceLevels.value = options.iceLevels

      return productList // lưu ý
    } catch (error) {
      console.error('Lỗi Store khi tải dữ liệu sản phẩm:', error)
      modalStore.showToast('Không thể tải dữ liệu sản phẩm và tùy chọn.', 'error')
      throw error
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

  /** 5. CREATE: Thêm một Size mới */
  const createSizeAction = async (sizeDto) => {
    productLoading.value = true
    productError.value = null
    try {
      const newSize = await productApi.createSize(sizeDto)

      // Cập nhật State: Thêm vào danh sách sizes hiện tại
      sizes.value.push(newSize)

      modalStore.showToast('Tạo kích cỡ thành công!', 'success')
      return newSize
    } catch (error) {
      productError.value = error.message || 'Không thể tạo kích cỡ mới.'
      modalStore.showToast(productError.value, 'error')
      throw error
    } finally {
      productLoading.value = false
    }
  }

  /** 6. UPDATE: Cập nhật thông tin Size */
  const updateSizeAction = async (id, updatedData) => {
    productLoading.value = true
    productError.value = null
    try {
      const updatedSize = await productApi.updateSize(id, updatedData)

      // Cập nhật State: Tìm và thay thế Size cũ
      const index = sizes.value.findIndex((s) => String(s.id) === String(id))
      if (index !== -1) {
        sizes.value[index] = updatedSize
      }

      modalStore.showToast('Cập nhật kích cỡ thành công!', 'success')
      return updatedSize
    } catch (error) {
      productError.value = error.message || 'Không thể cập nhật kích cỡ.'
      modalStore.showToast(productError.value, 'error')
      throw error
    } finally {
      productLoading.value = false
    }
  }

  /** 7. DELETE: Xóa một Size */
  const deleteSizeAction = async (id) => {
    productLoading.value = true
    productError.value = null
    try {
      await productApi.deleteSize(id)

      const index = sizes.value.findIndex((s) => s.id == id)
      if (index !== -1) sizes.value.splice(index, 1)

      modalStore.showToast('Xóa kích cỡ thành công!', 'success')
      return true
    } catch (error) {
      productError.value = error.message || 'Không thể xóa kích cỡ.'
      modalStore.showToast(productError.value, 'error')
      throw error
    } finally {
      productLoading.value = false
    }
  }

  /** 8. CREATE: Thêm một IceLevel mới */
  const createIceLevelAction = async (iceLevelDto) => {
    productLoading.value = true
    productError.value = null
    try {
      const newIceLevel = await productApi.createIceLevel(iceLevelDto)

      // Cập nhật State: Thêm vào danh sách IceLevels hiện tại
      iceLevels.value.push(newIceLevel)

      modalStore.showToast('Tạo kích cỡ thành công!', 'success')
      return newIceLevel
    } catch (error) {
      productError.value = error.message || 'Không thể tạo kích cỡ mới.'
      modalStore.showToast(productError.value, 'error')
      throw error
    } finally {
      productLoading.value = false
    }
  }

  /** 9. UPDATE: Cập nhật thông tin IceLevel */
  const updateIceLevelAction = async (id, updatedData) => {
    productLoading.value = true
    productError.value = null
    try {
      const updatedIceLevel = await productApi.updateIceLevel(id, updatedData)

      // Cập nhật State: Tìm và thay thế IceLevel cũ
      const index = iceLevels.value.findIndex((s) => String(s.id) === String(id))
      if (index !== -1) {
        iceLevels.value[index] = updatedIceLevel
      }

      modalStore.showToast('Cập nhật kích cỡ thành công!', 'success')
      return updatedIceLevel
    } catch (error) {
      productError.value = error.message || 'Không thể cập nhật kích cỡ.'
      modalStore.showToast(productError.value, 'error')
      throw error
    } finally {
      productLoading.value = false
    }
  }

  /** 10. DELETE: Xóa một IceLevel */
  const deleteIceLevelAction = async (id) => {
    productLoading.value = true
    productError.value = null
    try {
      await productApi.deleteIceLevel(id)

      const index = iceLevels.value.findIndex((s) => s.id == id)
      if (index !== -1) iceLevels.value.splice(index, 1)

      modalStore.showToast('Xóa kích cỡ thành công!', 'success')
      return true
    } catch (error) {
      productError.value = error.message || 'Không thể xóa kích cỡ.'
      modalStore.showToast(productError.value, 'error')
      throw error
    } finally {
      productLoading.value = false
    }
  }

  /** 11. CREATE: Thêm một SugarLevel mới */
  const createSugarLevelAction = async (sugarLevelDto) => {
    productLoading.value = true
    productError.value = null
    try {
      const newSugarLevel = await productApi.createSugarLevel(sugarLevelDto)

      // Cập nhật State: Thêm vào danh sách SugarLevels hiện tại
      sugarLevels.value.push(newSugarLevel)

      modalStore.showToast('Tạo kích cỡ thành công!', 'success')
      return newSugarLevel
    } catch (error) {
      productError.value = error.message || 'Không thể tạo kích cỡ mới.'
      modalStore.showToast(productError.value, 'error')
      throw error
    } finally {
      productLoading.value = false
    }
  }

  /** 12. UPDATE: Cập nhật thông tin SugarLevel */
  const updateSugarLevelAction = async (id, updatedData) => {
    productLoading.value = true
    productError.value = null
    try {
      const updatedSugarLevel = await productApi.updateSugarLevel(id, updatedData)

      // Cập nhật State: Tìm và thay thế SugarLevel cũ
      const index = sugarLevels.value.findIndex((s) => String(s.id) === String(id))
      if (index !== -1) {
        sugarLevels.value[index] = updatedSugarLevel
      }

      modalStore.showToast('Cập nhật kích cỡ thành công!', 'success')
      return updatedSugarLevel
    } catch (error) {
      productError.value = error.message || 'Không thể cập nhật kích cỡ.'
      modalStore.showToast(productError.value, 'error')
      throw error
    } finally {
      productLoading.value = false
    }
  }

  /** 13. DELETE: Xóa một SugarLevel */
  const deleteSugarLevelAction = async (id) => {
    productLoading.value = true
    productError.value = null
    try {
      await productApi.deleteSugarLevel(id)

      const index = sugarLevels.value.findIndex((s) => s.id == id)
      if (index !== -1) sugarLevels.value.splice(index, 1)

      modalStore.showToast('Xóa kích cỡ thành công!', 'success')
      return true
    } catch (error) {
      productError.value = error.message || 'Không thể xóa kích cỡ.'
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
    fetchProduct: fetchAllProductData,
    createProductAction,
    updateProductAction,
    deleteProductAction,

    createSizeAction,
    updateSizeAction,
    deleteSizeAction,

    createIceLevelAction,
    updateIceLevelAction,
    deleteIceLevelAction,

    createSugarLevelAction,
    updateSugarLevelAction,
    deleteSugarLevelAction,
  }
})
