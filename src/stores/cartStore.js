// src/stores/cartStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import cartApi from '@/apis/cartApi'

export const useCartStore = defineStore('cart', () => {
  // cart: object { id, userId, totalAmount, items: [...] }
  const cart = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const cartItems = computed(() => cart.value?.items ?? [])
  const totalQuantity = computed(
    () => cart.value?.items?.reduce((s, i) => s + (i.quantity || 0), 0) ?? 0,
  )
  const totalPrice = computed(() => cart.value?.totalAmount ?? 0)

  // fetchCart: GET /api/cart/me (should return cart read dto)
  async function fetchCart() {
    if (loading.value) return cart.value
    loading.value = true
    error.value = null
    try {
      const res = await cartApi.getCart()
      // res might be { data: {...} } or the object directly
      cart.value = res?.data ?? res
      return cart.value
    } catch (err) {
      error.value = err?.message || 'Không thể tải giỏ hàng'
      throw err
    } finally {
      loading.value = false
    }
  }

  // addToCart: send item, expect updated cart returned
  async function addToCart(itemDto) {
    loading.value = true
    error.value = null
    try {
      const res = await cartApi.addItem(itemDto)
      const newCart = res?.data ?? res
      if (newCart) cart.value = newCart
      return cart.value
    } catch (err) {
      error.value = err?.message || 'Thêm vào giỏ hàng thất bại'
      throw err
    } finally {
      loading.value = false
    }
  }

  // removeFromCart: cartItemId
  async function removeFromCart(cartItemId) {
    loading.value = true
    error.value = null
    try {
      const res = await cartApi.removeItem(cartItemId)
      const newCart = res?.data ?? res
      if (newCart) cart.value = newCart
      else {
        // if backend returns success only, refetch cart
        try {
          await fetchCart()
        } catch (e) {
          /* ignore */
        }
      }
      return cart.value
    } catch (err) {
      error.value = err?.message || 'Xóa khỏi giỏ hàng thất bại'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function clearCart() {
    loading.value = true
    error.value = null
    try {
      const res = await cartApi.clearCart()
      const newCart = res?.data ?? res
      cart.value = newCart ?? { id: null, items: [], totalAmount: 0 }
      return cart.value
    } catch (err) {
      error.value = err?.message || 'Xóa giỏ hàng thất bại'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateQuantity(cartItemId, quantity) {
    loading.value = true
    error.value = null
    try {
      // Gọi API backend
      const res = await cartApi.updateItem(cartItemId, { quantity })

      // Cập nhật state từ dữ liệu mới nhất server trả về
      const newCart = res?.data ?? res
      if (newCart) cart.value = newCart

      return cart.value
    } catch (err) {
      error.value = err?.message || 'Cập nhật số lượng thất bại'
      throw err
    } finally {
      loading.value = false
    }
  }

  function resetCartState() {
    cart.value = null
    loading.value = false
    error.value = null
  }

  return {
    cart,
    loading,
    error,
    cartItems,
    totalQuantity,
    totalPrice,
    fetchCart,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    resetCartState,
  }
})
