import { defineStore } from 'pinia'
import { ref } from 'vue'
import productApi from '@/api/productApi' // Import Service

export const useProductStore = defineStore('productStore', () => {
  // 🧩 STATE
  const products = ref([])
  const categories = ref([])
  const toppings = ref([])
  const sizes = ref([])
  const sugarLevels = ref([])
  const iceLevels = ref([])
  const productLoading = ref(false) // Thêm biến loading

  // 📦 ACTIONS
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
      console.error("Lỗi Store:", error)
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

    // actions
    fetchProduct,
    // (Các actions khác như: getProductById, filterProducts, ...)
  }
})