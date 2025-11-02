<script setup>
import NavLink from '@/components/common/NavLink.vue'
import { computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useAppStore } from '@/stores/appStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useModalStore } from '@/stores/modalStore'

// Components mới
import CartItemList from '@/components/customer/cart/CartItemList.vue'
import CartSummaryPanel from '@/components/customer/cart/CartSummaryPanel.vue'

// Import ảnh cho trạng thái giỏ hàng trống (cần đảm bảo đường dẫn đúng)
import emptyCartImage from '@/assets/others/empty-cart.png' 

const appStore = useAppStore()
const cartStore = useCartStore()
const userStore = useUserStore()
const modalStore = useModalStore()
const router = useRouter()

// Lấy refs từ Stores
const { cartItems, totalPrice } = storeToRefs(cartStore)
const { storePolicies } = storeToRefs(appStore)
const { isLoggedIn } = storeToRefs(userStore)

onMounted(async () => {
  // Đảm bảo lấy phí ship từ App Store
  // Cân nhắc gọi fetchAppConfig() ở main.js hoặc DefaultLayout để đảm bảo dữ liệu này luôn sẵn sàng
  await appStore.fetchStorePolicies()
})

// Tính phí giao hàng
const shippingFee = computed(() => {
  if (cartItems.value.length === 0) {
    return 0
  }
  // Lấy phí giao hàng từ chính sách (giả định policy đầu tiên)
  return Number(storePolicies.value?.[0]?.deliveryFee) || 0
})

const subtotal = computed(() => Number(totalPrice.value))
const total = computed(() => subtotal.value + shippingFee.value)
const hasItems = computed(() => cartItems.value.length > 0)

// 🚨 LOGIC THANH TOÁN ĐÃ TỐI ƯU
const checkout = () => {
  if (!hasItems.value) return

  if (!isLoggedIn.value) {
    // 1. Mở modal Login
    modalStore.openLoginModal()
    
    // 2. 🚨 Dùng Toast/Notification thay cho alert
    modalStore.showToast('Vui lòng đăng nhập trước khi thanh toán!', 'info', 4000)
    return
  }
  
  // 3. Chuyển sang trang Checkout nếu đã đăng nhập
  router.push('/checkout')
}
</script>

<template>
  <div class="max-w-6xl mx-auto py-10 px-4">
    <div v-if="hasItems" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Cột 1: Danh sách sản phẩm -->
      <div class="md:col-span-2">
        <CartItemList :cartItems="cartItems" />
      </div>

      <!-- Cột 2: Tóm tắt đơn hàng -->
      <div class="md:col-span-1">
        <CartSummaryPanel
          :subtotal="subtotal"
          :shippingFee="shippingFee"
          :total="total"
          :hasItems="hasItems"
          :isLoggedIn="isLoggedIn"
          @checkout="checkout"
        />
      </div>
    </div>

    <!-- Trạng thái giỏ hàng trống -->
    <div v-else class="text-center py-10 text-gray-500">
      <div class="max-w-xs mx-auto mb-4">
        <img
          :src="emptyCartImage"
          alt="Giỏ hàng trống"
          title="Giỏ hàng trống"
          class="opacity-70 w-full h-auto dark:opacity-100"
        />
      </div>
      <p class="text-gray-500 text-lg mb-2 dark:text-gray-200">Giỏ hàng của bạn đang trống!!!</p>
      <NavLink to="/products" variant="outline" class="text-gray-400 text-md"
        >Hãy thêm món ngon đầu tiên nào!</NavLink
      >
    </div>
  </div>
</template>