import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import cartApi from '@/api/cartApi' // 🚨 IMPORT CART API

export const useCartStore = defineStore('cart', () => {
  // State
  const cartItems = ref(JSON.parse(localStorage.getItem('cart') || '[]'))
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const totalQuantity = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    cartItems.value.reduce((sum, item) => {
      // Giữ nguyên logic tính giá
      const basePrice = Number(item.price) || 0;
      const sizePrice = Number(item.sizePrice) || 0;
      const toppingPrice = Number(item.toppingPrice) || 0;
      return sum + (basePrice + sizePrice + toppingPrice) * item.quantity;
    }, 0)
  )

  // Actions - Client Side (GIỮ NGUYÊN)
  function addToCart(item) {
    const existingItem = cartItems.value.find(
      (i) =>
        i.productId === item.productId &&
        i.size === item.size &&
        i.sugar === item.sugar &&
        i.ice === item.ice &&
        JSON.stringify(i.toppings) === JSON.stringify(item.toppings)
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      // 🚨 Đảm bảo item mới có ID duy nhất (đã có ở ProductDetail.vue)
      cartItems.value.push(item);
    }
  }

  function removeFromCart(id) {
    cartItems.value = cartItems.value.filter(item => item.id !== id)
  }

  function clearCart() {
    cartItems.value = []
  }

  function updateQuantity(id, quantity) {
    const item = cartItems.value.find(i => i.id === id)
    if (item) {
      item.quantity = Math.max(1, quantity)
    }
  }

  // 🚨 Actions - API Calls (Đã được đơn giản hóa để gọi API)
  const syncCartToServer = async (userId) => {
    if (!userId) return

    loading.value = true
    error.value = null

    try {
      // 🚨 GỌI API LAYER
      await cartApi.syncCartToServer(userId, cartItems.value)
    } catch (err) {
      error.value = err.message // Lưu lỗi vào State
    } finally {
      loading.value = false
    }
  }

  const loadCartFromServer = async (userId) => {
    if (!userId) return

    loading.value = true
    error.value = null

    try {
      // 🚨 GỌI API LAYER VÀ CẬP NHẬT STATE
      const items = await cartApi.loadCartFromServer(userId)
      if (items) {
        cartItems.value = items
      }
    } catch (err) {
      error.value = err.message // Lưu lỗi vào State
    } finally {
      loading.value = false
    }
  }

  // Watch (GIỮ NGUYÊN) - Đồng bộ với LocalStorage
  watch(cartItems, (val) => {
    localStorage.setItem('cart', JSON.stringify(val))
  }, { deep: true })

  return {
    // State
    cartItems,
    loading,
    error,
    
    // Computed
    totalQuantity,
    totalPrice,
    
    // Actions - Client
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    
    // Actions - API
    syncCartToServer,
    loadCartFromServer,
  }
})